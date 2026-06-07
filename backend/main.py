"""
FanPass API — FastAPI application.
Dev: SQLite | Prod: PostgreSQL (set DATABASE_URL env var).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from auth import router as auth_router
from tickets import router as tickets_router
from scan import router as scan_router
from mobility import router as mobility_router
from community import router as community_router
from events import router as events_router
from merch import router as merch_router

app = FastAPI(
    title="FanPass API",
    description="Smart Stadium Experience — Coupe du Monde 2030",
    version="0.2.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tickets_router)
app.include_router(scan_router)
app.include_router(mobility_router)
app.include_router(community_router)
app.include_router(events_router)
app.include_router(merch_router)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "fanpass-api", "version": "0.2.0"}
