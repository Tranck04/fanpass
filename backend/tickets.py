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

EVENT_ALIASES = {
    "match-mar-esp-opening": "match-001",
    "match-fra-bra-group": "match-002",
    "match-arg-ger-quarter": "match-003",
    "zone-casa-corniche": "event-001",
    "zone-rabat-ocean": "event-002",
    "event-jersey-launch": "event-003",
}

TIER_NAME_ALIASES = {
    "standard": "Standard",
    "vip": "Atlas VIP",
    "evening": "Pass Soiree",
    "access": "Pass Decouverte",
    "day": "Pass Journee",
}


def safe_json_list(value: str | None) -> list:
    try:
        parsed = json.loads(value) if value else []
        return parsed if isinstance(parsed, list) else []
    except Exception:
        return []


def normalize_event_type(event: Event) -> str:
    if event.category in ("official", "family", "fan_zone", "watch_party"):
        return "fan_zone"
    return "event"


def format_gate(gate_id: str | None) -> str:
    if not gate_id:
        return "Gate C"
    if gate_id.startswith("gate-"):
        return "Gate " + gate_id.replace("gate-", "").upper()
    return gate_id


def resolve_event_id(event_id: str | None) -> str | None:
    if not event_id:
        return None
    return EVENT_ALIASES.get(event_id, event_id)


def default_gate_for_event(event_id: str | None, db: Session) -> Gate | None:
    if event_id in ("match-002", "event-002"):
        return db.query(Gate).filter(Gate.id == "gate-e").first()
    if event_id == "match-003":
        return db.query(Gate).filter(Gate.id == "gate-b").first()
    return db.query(Gate).filter(Gate.id == "gate-c").first() or db.query(Gate).first()


def resolve_tier(event_id: str, tier_id: str | None, event_type: str, db: Session) -> TicketTier:
    query = db.query(TicketTier).filter(TicketTier.event_id == event_id)
    if tier_id:
        tier = query.filter(TicketTier.id == tier_id).first()
        if tier:
            return tier
        alias = TIER_NAME_ALIASES.get(tier_id)
        if alias:
            for candidate in query.all():
                normalized = candidate.name.replace("é", "e").replace("è", "e")
                if normalized.lower() == alias.lower():
                    return candidate

    tier = query.first()
    if tier:
        return tier

    fallback_name = "Standard" if event_type == "match" else "Pass Event"
    fallback_price = 950 if event_type == "match" else 160
    return TicketTier(
        id=f"fallback-{event_id}",
        event_type=event_type,
        event_id=event_id,
        name=fallback_name,
        price_mad=fallback_price,
        benefits=json.dumps(["QR securise", "Acces FanPass"]),
    )


def serialize_ticket(ticket: Ticket, db: Session, quantity: int = 1) -> dict:
    match = db.query(Match).filter(Match.id == ticket.match_id).first() if ticket.match_id else None
    event = db.query(Event).filter(Event.id == ticket.event_id).first() if ticket.event_id else None
    gate = db.query(Gate).filter(Gate.id == ticket.gate_id).first() if ticket.gate_id else None
    title = f"{match.team_home} vs {match.team_away}" if match else event.name if event else "Billet FanPass"
    subtitle = match.championship if match else event.subtitle if event else "Billet importe"
    city = match.city if match else event.city if event else "Casablanca"
    venue = match.venue if match else event.venue if event else "Grand Stade Hassan II"
    date = match.match_date if match else event.event_date if event else "14 juin 2030"
    time = match.kickoff_time if match else f"{event.start_time} - {event.end_time}" if event else "20:00"
    event_type = "match" if match else normalize_event_type(event) if event else "match"
    seat_label = " - ".join([x for x in [ticket.seat_section, ticket.seat_row, ticket.seat_number] if x])
    qr_raw = ticket.qr_signature if ticket.qr_signature and "." in ticket.qr_signature else None

    return {
        "id": ticket.id,
        "match_id": ticket.match_id,
        "event_id": ticket.event_id,
        "event_type": event_type,
        "title": title,
        "subtitle": subtitle,
        "city": city,
        "venue": venue,
        "date": date,
        "time": time,
        "gate_id": ticket.gate_id,
        "gate": format_gate(ticket.gate_id),
        "gate_code": gate.gate_code if gate else format_gate(ticket.gate_id).replace("Gate ", ""),
        "tier_name": ticket.tier_name,
        "price_mad": ticket.price_mad,
        "total_mad": (ticket.price_mad or 0) * quantity,
        "quantity": quantity,
        "seat_section": ticket.seat_section,
        "seat_row": ticket.seat_row,
        "seat_number": ticket.seat_number,
        "seat_label": seat_label or "Acces libre",
        "security_code": ticket.security_code,
        "access_zone": ticket.access_zone,
        "tribune": ticket.tribune,
        "access_control": ticket.access_control,
        "access_rules": safe_json_list(ticket.access_rules),
        "status": ticket.status,
        "import_source": ticket.import_source,
        "qr_payload": ticket.qr_payload,
        "qr_raw": qr_raw,
        "qr_seed": sum(ord(c) for c in ticket.id) % 233280,
        "purchased_at": ticket.purchased_at.isoformat() if ticket.purchased_at else None,
        "expires_at": ticket.expires_at.isoformat() if ticket.expires_at else None,
    }


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
        extra_tiers = [
            TicketTier(id="tier-004", event_type="match", event_id="match-002", name="Standard", price_mad=820,
                       benefits=json.dumps(["Siege assigne", "QR securise", "Entree visiteurs"])),
            TicketTier(id="tier-005", event_type="match", event_id="match-003", name="Premium", price_mad=2100,
                       benefits=json.dumps(["Tribune basse", "Acces rapide", "Fan kit"])),
            TicketTier(id="tier-006", event_type="fan_zone", event_id="event-002", name="Pass Journee", price_mad=160,
                       benefits=json.dumps(["Acces famille", "Live stats", "QR securise"])),
            TicketTier(id="tier-007", event_type="event", event_id="event-003", name="Pass Decouverte", price_mad=120,
                       benefits=json.dumps(["Showcase officiel", "Photo booth", "QR securise"])),
        ]
        for tier in extra_tiers:
            if not db.query(TicketTier).filter(TicketTier.id == tier.id).first():
                db.add(tier)
        db.commit()
    finally:
        db.close()


# ─── Endpoints ───

@router.get("")
def list_tickets(fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Liste les billets du fan connecté."""
    tickets = db.query(Ticket).filter(Ticket.fan_id == fan.id).order_by(Ticket.purchased_at.desc()).all()
    return [serialize_ticket(t, db) for t in tickets]


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
        gate = default_gate_for_event(m.id, db)
        result.append({
            "id": m.id, "type": "match", "title": f"{m.team_home} vs {m.team_away}",
            "subtitle": m.championship,
            "city": m.city, "venue": m.venue, "date": m.match_date, "time": m.kickoff_time,
            "density": "Forte",
            "description": f"{m.team_home} vs {m.team_away} - Coupe du Monde 2030 au Maroc.",
            "access": {
                "gate": format_gate(gate.id if gate else "gate-c"),
                "accessZone": "Perimetre securise",
                "tribune": "Tribune Atlas",
                "seatHint": "Place assignee",
                "accessControl": "Scan QR + controle identite aleatoire",
                "rules": ["Arrivee conseillee 90 min avant", "Sac cabine uniquement"],
            },
            "tiers": match_tiers,
        })
    for e in events:
        event_tiers = [{"id": t.id, "name": t.name, "price_mad": t.price_mad, "benefits": json.loads(t.benefits) if t.benefits else []}
                       for t in tiers if t.event_type in ("fan_zone", "event") and t.event_id == e.id]
        event_type = normalize_event_type(e)
        result.append({
            "id": e.id, "type": event_type,
            "title": e.name, "subtitle": e.subtitle, "city": e.city, "venue": e.venue,
            "date": e.event_date, "time": f"{e.start_time} - {e.end_time}",
            "density": "Vibrante" if e.density == "Dense" else "Calme" if e.density == "Calme" else "Moderee",
            "capacity_pct": e.capacity_pct, "description": e.description,
            "access": {
                "gate": "Entree principale" if event_type != "match" else "Gate C",
                "accessZone": "Zone event",
                "tribune": "Acces libre",
                "seatHint": "Acces selon jauge",
                "accessControl": "QR event + controle capacite",
                "rules": ["QR obligatoire", "Respecter les consignes de jauge"],
            },
            "tiers": event_tiers,
        })
    return result


@router.post("/purchase", status_code=201)
def purchase_ticket(body: dict, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Acheter un billet (match, fan zone ou event)."""
    ensure_seed_data()

    event_id = resolve_event_id(body.get("event_id"))
    tier_id = body.get("tier_id")
    gate_id = body.get("gate_id")
    quantity = body.get("quantity", 1)
    try:
        quantity = int(quantity)
    except (TypeError, ValueError):
        raise HTTPException(400, "Quantite invalide")
    if quantity < 1 or quantity > 4:
        raise HTTPException(400, "Quantite invalide")

    match = db.query(Match).filter(Match.id == event_id).first()
    event = db.query(Event).filter(Event.id == event_id).first() if not match else None
    if not match and not event:
        raise HTTPException(400, "Evenement introuvable")

    event_type = "match" if match else normalize_event_type(event)
    tier = resolve_tier(event_id, tier_id, event_type, db)
    if tier.event_id != event_id:
        raise HTTPException(400, "Tarif incompatible avec cet evenement")

    # Gate assignment
    if not gate_id:
        gate = default_gate_for_event(event_id, db)
        gate_id = gate.id if gate else "gate-c"

    gate = db.query(Gate).filter(Gate.id == gate_id).first()
    if not gate:
        raise HTTPException(400, "Gate introuvable")

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
        seat_section="Tribune Atlas" if match else "Acces libre",
        seat_row="12" if match else None,
        seat_number="47" if match else None,
        qr_payload="",
        qr_signature="",
        security_code=f"FP-{fan.id[:6].upper()}-{gate.gate_code}",
        access_zone="Perimetre Nord" if match else "Zone event",
        tribune="Tribune Atlas" if match else "Acces libre",
        access_control="Scan QR + controle identite aleatoire" if match else "QR event + controle capacite",
        access_rules=json.dumps(["Arrivee conseillee 18:30", "Sac cabine uniquement"] if match else ["QR obligatoire", "Respecter la jauge"]),
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

    return serialize_ticket(ticket, db, quantity)


@router.get("/{ticket_id}")
def get_ticket(ticket_id: str, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Détail d'un billet."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.fan_id == fan.id).first()
    if not ticket:
        raise HTTPException(404, "Billet introuvable")
    return serialize_ticket(ticket, db)


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
    raw_import = qr_data or ref

    ticket = Ticket(
        fan_id=fan.id,
        match_id="match-001",
        gate_id=gate.id if gate else "gate-c",
        tier_name="Importé",
        price_mad=0,
        seat_section="À confirmer",
        qr_payload=raw_import,
        qr_signature="",
        security_code=f"IMP-{fan.id[:6].upper()}",
        import_source="external_ref" if import_type == "ref" else "external_qr",
        import_ref=ref or None,
        status="valid",
        purchased_at=now,
        expires_at=expires,
    )
    db.add(ticket)
    db.flush()
    signed_payload = {
        "ticket_id": ticket.id,
        "fan_id": fan.id,
        "event_id": ticket.match_id,
        "gate_code": gate.gate_code if gate else "C",
        "import_ref": ref,
        "type": import_type,
        "nonce": gen_uuid()[:12],
        "issued_at": now.isoformat(),
    }
    ticket.qr_payload = json.dumps(signed_payload)
    ticket.qr_signature = sign_qr_payload(signed_payload)
    db.commit()
    db.refresh(ticket)

    return serialize_ticket(ticket, db)


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
    if transfer.to_email.lower() != fan.email.lower():
        raise HTTPException(403, "Ce transfert est destine a un autre compte")

    # Transfer ownership
    ticket.fan_id = fan.id
    ticket.security_code = f"FP-{fan.id[:6].upper()}-{(ticket.gate_id or 'gate-c').replace('gate-', '').upper()}"
    rotated_payload = {
        "ticket_id": ticket.id,
        "fan_id": fan.id,
        "event_id": ticket.match_id or ticket.event_id,
        "gate_code": (ticket.gate_id or "gate-c").replace("gate-", "").upper(),
        "nonce": gen_uuid()[:12],
        "issued_at": datetime.now(timezone.utc).isoformat(),
        "transfer_id": transfer.id,
    }
    ticket.qr_payload = json.dumps(rotated_payload)
    ticket.qr_signature = sign_qr_payload(rotated_payload)
    transfer.to_fan_id = fan.id
    transfer.status = "accepted"
    transfer.accepted_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ticket)

    return serialize_ticket(ticket, db)
