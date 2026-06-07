"""
Scan validation — vérifie un QR signé et retourne le résultat.
"""

import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Ticket, TicketScan, Gate, gen_uuid
from tickets import verify_qr

router = APIRouter(prefix="/api/scan", tags=["scan"])


@router.post("/validate")
def validate_scan(body: dict, db: Session = Depends(get_db)):
    """
    Scanner un QR et valider l'accès.
    Body: { "qr_raw": "...", "gate_id": "...", "device_id": "..." }
    """
    qr_raw = body.get("qr_raw", "")
    gate_id = body.get("gate_id", "")
    device_id = body.get("device_id", "unknown")

    if not qr_raw:
        raise HTTPException(400, "QR requis")

    # 1. Vérifier la signature
    payload = verify_qr(qr_raw)
    if payload is None:
        return record_scan(None, gate_id, device_id, "invalid_ticket", "Signature QR invalide", db)

    ticket_id = payload.get("ticket_id")
    if not ticket_id:
        return record_scan(None, gate_id, device_id, "invalid_ticket", "QR sans ticket_id", db)

    # 2. Trouver le billet
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        return record_scan(ticket_id, gate_id, device_id, "invalid_ticket", "Billet introuvable", db)

    # 3. Vérifier le statut
    if ticket.status == "scanned":
        return record_scan(ticket_id, gate_id, device_id, "already_used", "Billet déjà scanné", db)
    if ticket.status == "cancelled":
        return record_scan(ticket_id, gate_id, device_id, "ticket_cancelled", "Billet annulé", db)
    if ticket.status == "expired":
        return record_scan(ticket_id, gate_id, device_id, "invalid_ticket", "Billet expiré", db)

    # 4. Vérifier la gate (si spécifiée)
    if gate_id:
        gate = db.query(Gate).filter(Gate.id == gate_id).first()
        if gate and ticket.gate_id and ticket.gate_id != gate_id:
            return record_scan(ticket_id, gate_id, device_id, "wrong_gate",
                               f"Attendu: {ticket.gate_id}, Scanné: {gate_id}", db)

    # 5. Accès accordé
    ticket.status = "scanned"
    ticket.scanned_at = datetime.now(timezone.utc)
    db.commit()

    return record_scan(ticket_id, gate_id, device_id, "access_granted", "Accès autorisé ✓", db)


def record_scan(ticket_id: str | None, gate_id: str, device_id: str,
                result: str, notes: str, db: Session) -> dict:
    scan = TicketScan(
        ticket_id=ticket_id or "unknown",
        gate_id=gate_id or "unknown",
        device_id=device_id,
        result=result,
        operator_notes=notes,
        synced=True,
    )
    db.add(scan)
    db.commit()

    emoji = {"access_granted": "✅", "wrong_gate": "⚠️", "already_used": "❌",
             "invalid_ticket": "🚫", "ticket_cancelled": "❌", "fan_id_required": "🔒",
             "manual_review": "👁️"}.get(result, "❓")

    return {
        "result": result,
        "message": f"{emoji} {notes}",
        "ticket_id": ticket_id,
        "gate_id": gate_id,
        "scanned_at": scan.scanned_at.isoformat(),
    }


@router.get("/stats/{match_id}")
def scan_stats(match_id: str, db: Session = Depends(get_db)):
    """Statistiques de scan pour un match."""
    tickets = db.query(Ticket).filter(Ticket.match_id == match_id).all()
    ticket_ids = [t.id for t in tickets]

    total = len(tickets)
    scanned = db.query(TicketScan).filter(
        TicketScan.ticket_id.in_(ticket_ids),
        TicketScan.result == "access_granted"
    ).count() if ticket_ids else 0

    wrong_gate = db.query(TicketScan).filter(
        TicketScan.ticket_id.in_(ticket_ids),
        TicketScan.result == "wrong_gate"
    ).count() if ticket_ids else 0

    already_used = db.query(TicketScan).filter(
        TicketScan.ticket_id.in_(ticket_ids),
        TicketScan.result == "already_used"
    ).count() if ticket_ids else 0

    return {
        "match_id": match_id,
        "total_tickets": total,
        "scanned": scanned,
        "occupancy_pct": round(scanned / total * 100, 1) if total > 0 else 0,
        "wrong_gate": wrong_gate,
        "already_used": already_used,
        "no_show": total - scanned if total > 0 else 0,
    }
