"""
Database setup — SQLite (dev) / PostgreSQL (prod).
Switch via DATABASE_URL environment variable.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./fanpass.db")

# Sync engine for table creation & seeding
SYNC_DATABASE_URL = DATABASE_URL.replace("+aiosqlite", "")

# Render provides PostgreSQL URLs as postgresql:// — SQLAlchemy
# needs postgresql+psycopg2:// for synchronous connections.
if SYNC_DATABASE_URL.startswith("postgres://"):
    SYNC_DATABASE_URL = SYNC_DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif SYNC_DATABASE_URL.startswith("postgresql://") and "+" not in SYNC_DATABASE_URL.split("://")[1].split("/")[0]:
    SYNC_DATABASE_URL = SYNC_DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

engine = create_engine(SYNC_DATABASE_URL, echo=False, connect_args={"check_same_thread": False} if "sqlite" in SYNC_DATABASE_URL else {})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Dependency for FastAPI endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables and seed data."""
    Base.metadata.create_all(bind=engine)
