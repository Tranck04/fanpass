"""
SQLAlchemy models — SQLite dev / PostgreSQL prod.
UUIDs generated Python-side for SQLite compat.
v3 — Smart Ticketing : FanID enrichi, transferts, scans.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Fan(Base):
    __tablename__ = "fan"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(30), nullable=True)
    nationality = Column(String(100), nullable=True)
    language = Column(String(10), default="fr", nullable=False)
    supported_team = Column(String(100), nullable=True)
    fan_profile = Column(String(20), default="solo", nullable=False)
    fan_id_status = Column(String(20), default="pending", nullable=False)
    document_type = Column(String(30), nullable=True)
    document_number = Column(String(100), nullable=True)
    document_verified_at = Column(DateTime, nullable=True)
    first_name_locked = Column(Boolean, default=False)
    last_name_locked = Column(Boolean, default=False)
    nationality_locked = Column(Boolean, default=False)
    document_number_locked = Column(Boolean, default=False)
    date_of_birth = Column(String, nullable=True)
    mrz_raw = Column(Text, nullable=True)
    photo_url = Column(Text, nullable=True)
    accessibility_needs = Column(String(30), nullable=True)
    fan_id_expires_at = Column(DateTime, nullable=True)
    avatar_initials = Column(String(10), default="YA")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    tickets = relationship("Ticket", back_populates="fan")
    orders = relationship("Order", back_populates="fan")

    __table_args__ = (
        CheckConstraint(
            "fan_id_status IN ('pending', 'verified', 'rejected', 'suspended', 'expired')",
            name="ck_fan_status"
        ),
        CheckConstraint(
            "fan_profile IN ('solo', 'family', 'tourist', 'local', 'group', 'calm')",
            name="ck_fan_profile"
        ),
        CheckConstraint(
            "language IN ('fr', 'en', 'es', 'ar')",
            name="ck_fan_language"
        ),
        CheckConstraint(
            "document_type IS NULL OR document_type IN ('passport', 'id_card', 'residence_permit')",
            name="ck_fan_doc_type"
        ),
        CheckConstraint(
            "accessibility_needs IS NULL OR accessibility_needs IN ('pmr', 'family', 'assistance', 'none')",
            name="ck_fan_accessibility"
        ),
    )


class Gate(Base):
    __tablename__ = "gate"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    stadium_id = Column(String(36), nullable=False)
    gate_code = Column(String(20), nullable=False)
    zone = Column(String(50), nullable=True)
    access_type = Column(String(30), default="general")
    crowd_status = Column(String(20), default="low", nullable=False)
    estimated_wait_min = Column(Integer, default=0)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        CheckConstraint("access_type IN ('general', 'vip', 'pmr', 'family', 'away_fans')", name="ck_gate_access"),
        CheckConstraint("crowd_status IN ('low', 'medium', 'high', 'closed')", name="ck_gate_crowd"),
    )


class Match(Base):
    __tablename__ = "match"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    stadium_id = Column(String(36), nullable=False)
    team_home = Column(String(100), nullable=False)
    team_away = Column(String(100), nullable=False)
    match_date = Column(String(20), nullable=False)
    kickoff_time = Column(String(10), nullable=False)
    championship = Column(String(100), nullable=False)
    status = Column(String(20), default="scheduled", nullable=False)
    venue = Column(String(200), nullable=True)
    city = Column(String(100), nullable=True)

    __table_args__ = (
        CheckConstraint("status IN ('scheduled', 'live', 'finished', 'cancelled')", name="ck_match_status"),
    )


class Event(Base):
    __tablename__ = "event"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    match_id = Column(String(36), nullable=True)
    name = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False)
    subtitle = Column(String(200), nullable=True)
    venue = Column(String(200), nullable=True)
    city = Column(String(100), nullable=True)
    event_date = Column(String(20), nullable=True)
    start_time = Column(String(10), nullable=True)
    end_time = Column(String(10), nullable=True)
    density = Column(String(20), default="Calme")
    capacity_pct = Column(Integer, default=50)
    description = Column(Text, nullable=True)
    price_label = Column(String(100), nullable=True)
    is_official = Column(Boolean, default=False)

    __table_args__ = (
        CheckConstraint(
            "category IN ('official', 'watch', 'sponsor', 'club', 'family', 'fan_zone', 'watch_party', 'club_event', 'community')",
            name="ck_event_category"
        ),
        CheckConstraint("density IN ('Calme', 'Controle', 'Dense')", name="ck_event_density"),
        CheckConstraint("capacity_pct BETWEEN 0 AND 100", name="ck_event_capacity"),
    )


class TicketTier(Base):
    __tablename__ = "ticket_tier"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    event_type = Column(String(20), nullable=False)
    event_id = Column(String(36), nullable=False)
    name = Column(String(50), nullable=False)
    price_mad = Column(Integer, nullable=False)
    benefits = Column(Text, nullable=True)  # JSON string
    max_per_order = Column(Integer, default=4)

    __table_args__ = (
        CheckConstraint("event_type IN ('match', 'fan_zone', 'event')", name="ck_tier_type"),
        CheckConstraint("price_mad >= 0", name="ck_tier_price"),
    )


class Ticket(Base):
    __tablename__ = "ticket"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    fan_id = Column(String(36), ForeignKey("fan.id", ondelete="RESTRICT"), nullable=False, index=True)
    match_id = Column(String(36), nullable=True)
    event_id = Column(String(36), nullable=True)
    gate_id = Column(String(36), nullable=False)
    tier_name = Column(String(50), nullable=True)
    price_mad = Column(Integer, nullable=True)
    seat_section = Column(String(50), nullable=True)
    seat_row = Column(String(10), nullable=True)
    seat_number = Column(String(10), nullable=True)
    qr_payload = Column(Text, nullable=False)
    qr_signature = Column(Text, nullable=False)
    security_code = Column(String(50), nullable=True)
    access_zone = Column(String(100), nullable=True)
    tribune = Column(String(100), nullable=True)
    access_control = Column(String(255), nullable=True)
    access_rules = Column(Text, nullable=True)  # JSON string
    import_source = Column(String(30), nullable=True)  # "fanpass" | "external_qr" | "external_ref" | "partner"
    import_ref = Column(String(100), nullable=True)
    status = Column(String(20), default="valid", nullable=False)
    purchased_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    scanned_at = Column(DateTime, nullable=True)

    fan = relationship("Fan", back_populates="tickets")
    transfers = relationship("TicketTransfer", back_populates="ticket", foreign_keys="TicketTransfer.ticket_id")
    scans = relationship("TicketScan", back_populates="ticket")

    __table_args__ = (
        CheckConstraint(
            "status IN ('valid', 'scanned', 'cancelled', 'expired', 'transferred')",
            name="ck_ticket_status"
        ),
        CheckConstraint(
            "import_source IS NULL OR import_source IN ('fanpass', 'external_qr', 'external_ref', 'partner')",
            name="ck_ticket_import_source"
        ),
    )


class TicketTransfer(Base):
    __tablename__ = "ticket_transfer"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    ticket_id = Column(String(36), ForeignKey("ticket.id", ondelete="CASCADE"), nullable=False, index=True)
    from_fan_id = Column(String(36), ForeignKey("fan.id"), nullable=False)
    to_email = Column(String(255), nullable=False, index=True)
    to_fan_id = Column(String(36), ForeignKey("fan.id"), nullable=True)
    status = Column(String(20), default="pending", nullable=False)
    transfer_code = Column(String(8), nullable=False, unique=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    accepted_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=False)

    ticket = relationship("Ticket", back_populates="transfers", foreign_keys=[ticket_id])

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'accepted', 'rejected', 'cancelled', 'expired')",
            name="ck_transfer_status"
        ),
    )


class TicketScan(Base):
    __tablename__ = "ticket_scan"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    ticket_id = Column(String(36), ForeignKey("ticket.id"), nullable=False, index=True)
    gate_id = Column(String(36), nullable=False)
    scanned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    result = Column(String(30), nullable=False)
    device_id = Column(String(100), nullable=True)
    synced = Column(Boolean, default=False, nullable=False)
    operator_notes = Column(Text, nullable=True)

    ticket = relationship("Ticket", back_populates="scans")

    __table_args__ = (
        CheckConstraint(
            "result IN ('access_granted', 'wrong_gate', 'already_used', 'invalid_ticket', 'fan_id_required', 'ticket_cancelled', 'manual_review')",
            name="ck_scan_result"
        ),
    )


class Order(Base):
    __tablename__ = "order"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    fan_id = Column(String(36), ForeignKey("fan.id", ondelete="RESTRICT"), nullable=False)
    status = Column(String(20), default="pending", nullable=False)
    total_mad = Column(Integer, nullable=False)
    pickup_type = Column(String(20), default="stadium", nullable=True)
    pickup_location = Column(String(255), nullable=True)
    ordered_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    fan = relationship("Fan", back_populates="orders")
