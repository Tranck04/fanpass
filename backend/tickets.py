"""
Smart Ticketing — purchase, import, transfer, QR signing.
QR design: offline-first signed QR with HMAC-SHA256.
"""

import hashlib
import hmac
import json
import os
import random
import string
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, SessionLocal
from models import Fan, Ticket, TicketTier, TicketTransfer, Match, Event, Gate, gen_uuid
from auth import get_current_fan

router = APIRouter(prefix="/api/tickets", tags=["tickets"])

SECRET_KEY = os.getenv("QR_SECRET_KEY", "fanpass-qr-secret-dev")
QR_ALGORITHM = "sha256"


def sign_qr_payload(payload: dict) -> str:
    """Sign a QR payload with HMAC-SHA256."""
    payload_str = json.dumps(payload, sort_keys=True)
    sig = hmac.new(SECRET_KEY.encode(), payload_str.encode(), hashlib.sha256).hexdigest()
    return payload_str + "." + sig


def verify_qr(raw: str) -> dict | None:
    """Verify a signed QR payload. Returns payload dict or None if invalid."""
    try:
        parts = raw.rsplit(".", 1)
        if len(parts) != 2:
            return None
        payload_str, sig = parts
        expected = hmac.new(SECRET_KEY.encode(), payload_str.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, sig):
            return None
        return json.loads(payload_str)
    except Exception:
        return None


def generate_transfer_code() -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=8))


# ─── Seed helpers (MVP) ───

def ensure_seed_data():
    """Ensure seed matches, events, gates, and tiers exist."""
    db = SessionLocal()
    try:
        if db.query(Match).count() == 0:
            db.add_all([
                Match(id="match-001", stadium_id="stadium-001", team_home="Maroc", team_away="Espagne",
                      match_date="2030-06-14", kickoff_time="20:00", championship="FIFA World Cup 2030",
                      status="scheduled", venue="Grand Stade Hassan II", city="Casablanca"),
                Match(id="match-002", stadium_id="stadium-002", team_home="France", team_away="Bresil",
                      match_date="2030-06-18", kickoff_time="18:00", championship="FIFA World Cup 2030",
                      status="scheduled", venue="Stade Prince Moulay Abdellah", city="Rabat"),
                Match(id="match-003", stadium_id="stadium-003", team_home="Argentine", team_away="Allemagne",
                      match_date="2030-07-04", kickoff_time="21:00", championship="FIFA World Cup 2030",
                      status="scheduled", venue="Stade de Marrakech", city="Marrakech"),
            ])
        if db.query(Event).count() == 0:
            db.add_all([
                Event(id="event-001", match_id="match-001", name="Casablanca Corniche", category="official",
                      subtitle="Fan zone officielle", venue="Corniche Ain Diab", city="Casablanca",
                      event_date="2030-06-14", start_time="16:00", end_time="01:00", density="Dense",
                      capacity_pct=82, description="Écran géant, DJ live, street food.", is_official=True),
                Event(id="event-002", match_id="match-002", name="Rabat Ocean Stage", category="family",
                      subtitle="Familles, food court", venue="Bouregreg Fan Park", city="Rabat",
                      event_date="2030-06-18", start_time="14:00", end_time="23:30", density="Calme",
                      capacity_pct=46, description="Zone assise, stats live.", is_official=False),
                Event(id="event-003", match_id="match-001", name="Lancement Maillot Maroc 2030", category="club",
                      subtitle="Showcase officiel", venue="FanPass Arena Pop-up", city="Casablanca",
                      event_date="2030-06-13", start_time="19:00", end_time="22:00", density="Controle",
                      capacity_pct=54, description="Révélation maillot.", is_official=True),
            ])
        if db.query(Gate).count() == 0:
            db.add_all([
                Gate(id="gate-c", stadium_id="stadium-001", gate_code="C", zone="Nord", access_type="vip",
                     crowd_status="medium", estimated_wait_min=8),
                Gate(id="gate-e", stadium_id="stadium-002", gate_code="E", zone="Est", access_type="away_fans",
                     crowd_status="medium", estimated_wait_min=11),
                Gate(id="gate-b", stadium_id="stadium-003", gate_code="B", zone="Sud", access_type="general",
                     crowd_status="low", estimated_wait_min=6),
            ])
        if db.query(TicketTier).count() == 0:
            db.add_all([
                TicketTier(id="tier-001", event_type="match", event_id="match-001", name="Standard", price_mad=950,
                           benefits=json.dumps(["Siège assigné", "QR sécurisé", "Itinéraire gate-aware"])),
                TicketTier(id="tier-002", event_type="match", event_id="match-001", name="Atlas VIP", price_mad=3200,
                           benefits=json.dumps(["Lounge avant-match", "Gate prioritaire", "Merch inclus"])),
                TicketTier(id="tier-003", event_type="fan_zone", event_id="event-001", name="Pass Soirée", price_mad=220,
                           benefits=json.dumps(["Accès fan zone", "Animations live", "QR sécurisé"])),
            ])
        db.commit()
    finally:
        db.close()


# ─── Endpoints ───

@router.get("")
def list_tickets(fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Liste les billets du fan connecté."""
    tickets = db.query(Ticket).filter(Ticket.fan_id == fan.id).order_by(Ticket.purchased_at.desc()).all()
    return [
        {
            "id": t.id, "match_id": t.match_id, "event_id": t.event_id,
            "gate_id": t.gate_id, "tier_name": t.tier_name, "price_mad": t.price_mad,
            "seat_section": t.seat_section, "seat_row": t.seat_row, "seat_number": t.seat_number,
            "security_code": t.security_code, "access_zone": t.access_zone, "tribune": t.tribune,
            "access_control": t.access_control, "status": t.status,
            "import_source": t.import_source,
            "purchased_at": t.purchased_at.isoformat() if t.purchased_at else None,
            "expires_at": t.expires_at.isoformat() if t.expires_at else None,
        }
        for t in tickets
    ]


@router.get("/events")
def list_events(db: Session = Depends(get_db)):
    """Catalogue des matchs, fan zones et events disponibles."""
    ensure_seed_data()
    matches = db.query(Match).all()
    events = db.query(Event).all()
    tiers = db.query(TicketTier).all()

    result = []
    for m in matches:
        match_tiers = [{"id": t.id, "name": t.name, "price_mad": t.price_mad, "benefits": json.loads(t.benefits) if t.benefits else []}
                       for t in tiers if t.event_type == "match" and t.event_id == m.id]
        result.append({
            "id": m.id, "type": "match", "title": f"{m.team_home} vs {m.team_away}",
            "city": m.city, "venue": m.venue, "date": m.match_date, "time": m.kickoff_time,
            "tiers": match_tiers,
        })
    for e in events:
        event_tiers = [{"id": t.id, "name": t.name, "price_mad": t.price_mad, "benefits": json.loads(t.benefits) if t.benefits else []}
                       for t in tiers if t.event_type in ("fan_zone", "event") and t.event_id == e.id]
        result.append({
            "id": e.id, "type": "fan_zone" if e.category == "official" else "event",
            "title": e.name, "subtitle": e.subtitle, "city": e.city, "venue": e.venue,
            "date": e.event_date, "time": f"{e.start_time} - {e.end_time}",
            "density": e.density, "capacity_pct": e.capacity_pct, "description": e.description,
            "tiers": event_tiers,
        })
    return result


@router.post("/purchase", status_code=201)
def purchase_ticket(body: dict, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Acheter un billet (match, fan zone ou event)."""
    ensure_seed_data()

    event_id = body.get("event_id")
    tier_id = body.get("tier_id")
    gate_id = body.get("gate_id")

    tier = db.query(TicketTier).filter(TicketTier.id == tier_id).first()
    if not tier:
        raise HTTPException(400, "Tier introuvable")

    # Gate assignment
    if not gate_id:
        gate = db.query(Gate).first()
        gate_id = gate.id if gate else "gate-c"

    gate = db.query(Gate).filter(Gate.id == gate_id).first()
    if not gate:
        raise HTTPException(400, "Gate introuvable")

    # Déterminer si c'est un match ou un event
    match = db.query(Match).filter(Match.id == event_id).first()
    event = db.query(Event).filter(Event.id == event_id).first() if not match else None

    now = datetime.now(timezone.utc)
    expires = now + timedelta(days=30)

    # Build QR payload
    qr_data = {
        "ticket_id": "",
        "fan_id": fan.id,
        "event_id": event_id,
        "gate_code": gate.gate_code,
        "nonce": gen_uuid()[:12],
        "issued_at": now.isoformat(),
    }

    ticket = Ticket(
        fan_id=fan.id,
        match_id=match.id if match else None,
        event_id=event.id if event else None,
        gate_id=gate.id,
        tier_name=tier.name,
        price_mad=tier.price_mad,
        seat_section="Tribune Atlas",
        seat_row="12",
        seat_number="47",
        qr_payload="",
        qr_signature="",
        security_code=f"FP-{fan.id[:6].upper()}-{gate.gate_code}",
        access_zone="Périmètre Nord",
        tribune="Tribune Atlas",
        access_control="Scan QR + contrôle identité aléatoire",
        access_rules=json.dumps(["Arrivée conseillée 18:30", "Sac cabine uniquement"]),
        import_source="fanpass",
        status="valid",
        purchased_at=now,
        expires_at=expires,
    )

    db.add(ticket)
    db.flush()

    # Now sign the QR with the real ticket ID
    qr_data["ticket_id"] = ticket.id
    ticket.qr_payload = json.dumps(qr_data)
    ticket.qr_signature = sign_qr_payload(qr_data)

    db.commit()
    db.refresh(ticket)

    return {"id": ticket.id, "status": ticket.status, "security_code": ticket.security_code}


@router.get("/{ticket_id}")
def get_ticket(ticket_id: str, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Détail d'un billet."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.fan_id == fan.id).first()
    if not ticket:
        raise HTTPException(404, "Billet introuvable")
    return {
        "id": ticket.id, "fan_id": ticket.fan_id, "match_id": ticket.match_id,
        "event_id": ticket.event_id, "gate_id": ticket.gate_id,
        "tier_name": ticket.tier_name, "price_mad": ticket.price_mad,
        "seat_section": ticket.seat_section, "seat_row": ticket.seat_row,
        "seat_number": ticket.seat_number, "security_code": ticket.security_code,
        "access_zone": ticket.access_zone, "tribune": ticket.tribune,
        "access_control": ticket.access_control,
        "access_rules": json.loads(ticket.access_rules) if ticket.access_rules else [],
        "status": ticket.status, "import_source": ticket.import_source,
        "qr_payload": ticket.qr_payload,
        "purchased_at": ticket.purchased_at.isoformat() if ticket.purchased_at else None,
        "expires_at": ticket.expires_at.isoformat() if ticket.expires_at else None,
    }


@router.post("/import")
def import_ticket(body: dict, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Importer un billet externe (par référence ou QR)."""
    import_type = body.get("type", "ref")  # "ref" | "qr"
    ref = body.get("reference", "").strip()
    qr_data = body.get("qr_data", "").strip()

    if import_type == "ref" and not ref:
        raise HTTPException(400, "Référence requise")
    if import_type == "qr" and not qr_data:
        raise HTTPException(400, "QR requis")

    # Vérifier que le billet n'est pas déjà importé
    if ref:
        existing = db.query(Ticket).filter(Ticket.import_ref == ref).first()
        if existing:
            raise HTTPException(400, "Ce billet a déjà été importé")

    ensure_seed_data()
    gate = db.query(Gate).first()
    now = datetime.now(timezone.utc)
    expires = now + timedelta(days=30)

    ticket = Ticket(
        fan_id=fan.id,
        match_id="match-001",
        gate_id=gate.id if gate else "gate-c",
        tier_name="Importé",
        price_mad=0,
        seat_section="À confirmer",
        qr_payload=qr_data or ref,
        qr_signature=sign_qr_payload({"ref": ref, "type": import_type, "fan_id": fan.id}),
        security_code=f"IMP-{fan.id[:6].upper()}",
        import_source="external_ref" if import_type == "ref" else "external_qr",
        import_ref=ref or None,
        status="valid",
        purchased_at=now,
        expires_at=expires,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {"id": ticket.id, "status": "valid", "message": "Billet importé avec succès"}


@router.post("/{ticket_id}/transfer")
def transfer_ticket(ticket_id: str, body: dict, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Initier un transfert de billet vers un email."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.fan_id == fan.id).first()
    if not ticket:
        raise HTTPException(404, "Billet introuvable")
    if ticket.status != "valid":
        raise HTTPException(400, "Ce billet ne peut pas être transféré (statut: " + ticket.status + ")")

    to_email = body.get("to_email", "").strip()
    if not to_email:
        raise HTTPException(400, "Email du destinataire requis")

    code = generate_transfer_code()
    transfer = TicketTransfer(
        ticket_id=ticket.id,
        from_fan_id=fan.id,
        to_email=to_email,
        transfer_code=code,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
    )
    db.add(transfer)
    db.commit()
    db.refresh(transfer)

    return {
        "transfer_id": transfer.id,
        "transfer_code": code,
        "to_email": to_email,
        "expires_at": transfer.expires_at.isoformat(),
        "message": f"Code de transfert envoyé à {to_email}",
    }


@router.post("/transfer/accept/{code}")
def accept_transfer(code: str, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Accepter un transfert de billet avec le code reçu."""
    transfer = db.query(TicketTransfer).filter(
        TicketTransfer.transfer_code == code,
        TicketTransfer.status == "pending",
    ).first()

    if not transfer:
        raise HTTPException(404, "Code de transfert invalide ou expiré")
    if transfer.expires_at < datetime.now(timezone.utc):
        transfer.status = "expired"
        db.commit()
        raise HTTPException(400, "Ce transfert a expiré")

    ticket = db.query(Ticket).filter(Ticket.id == transfer.ticket_id).first()
    if not ticket:
        raise HTTPException(404, "Billet introuvable")

    # Transfer ownership
    ticket.fan_id = fan.id
    transfer.to_fan_id = fan.id
    transfer.status = "accepted"
    transfer.accepted_at = datetime.now(timezone.utc)

    db.commit()

    return {"id": ticket.id, "message": "Billet accepté avec succès !"}
