"""
Fan Community Matching — connecter les supporters aux bons groupes et événements.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Fan, Ticket
from auth import get_current_fan

router = APIRouter(prefix="/api/community", tags=["community"])

# ─── Seed groups (matches frontend structure) ───

GROUPS = [
    {"id": "atlas-fr-gate-c", "name": "Atlas Gate C", "team": "Maroc", "language": "FR",
     "city": "Casablanca", "match": "Maroc vs Espagne", "profiles": ["solo", "local", "group"],
     "size": 42, "capacity": 60, "meet_point": "Casa Port - sortie tram", "meet_time": "17:25",
     "destination": "Grand Stade Hassan II - Gate C", "event_rec": "Meet-up Supporters Atlas",
     "mood": "Intense", "safety": "Guide FanPass présent, corridor sécurisé.",
     "route": "Départ groupe vers drop-off Nord puis marche finale.",
     "gate": "gate-c", "verified": True, "ambiance": "festive"},

    {"id": "morocco-en-tourists", "name": "Morocco Welcome Crew", "team": "Maroc", "language": "EN",
     "city": "Casablanca", "match": "Maroc vs Espagne", "profiles": ["solo", "tourist", "calm"],
     "size": 27, "capacity": 40, "meet_point": "Marina Casablanca", "meet_time": "17:00",
     "destination": "Casablanca Corniche fan zone", "event_rec": "Casablanca Corniche",
     "mood": "Social", "safety": "Point facile à trouver, support EN/FR.",
     "route": "Fan zone avant match puis navette vers Gate C.",
     "gate": "gate-c", "verified": True, "ambiance": "tourisme"},

    {"id": "family-rabat-ocean", "name": "Family Ocean Route", "team": "France", "language": "FR",
     "city": "Rabat", "match": "France vs Bresil", "profiles": ["family", "tourist", "calm"],
     "size": 18, "capacity": 36, "meet_point": "Bouregreg Marina", "meet_time": "15:45",
     "destination": "Rabat Ocean Stage", "event_rec": "Rabat Ocean Stage",
     "mood": "Famille", "safety": "Zone assise, assistance enfants.",
     "route": "Parking Marina puis entrée Family.", "gate": "gate-e", "verified": True, "ambiance": "famille"},

    {"id": "brasil-es-watch", "name": "Brasil Watch Party ES", "team": "Bresil", "language": "ES",
     "city": "Rabat", "match": "France vs Bresil", "profiles": ["solo", "group", "tourist"],
     "size": 31, "capacity": 55, "meet_point": "Place Al Barid", "meet_time": "15:30",
     "destination": "Meet-up Supporters Atlas", "event_rec": "Meet-up Supporters Atlas",
     "mood": "Social", "safety": "Groupe temporaire avec modération FanPass.",
     "route": "Départ collectif vers Gate E.", "gate": "gate-e", "verified": True, "ambiance": "sociale"},

    {"id": "espana-calm-casa", "name": "Espana Calm Entry", "team": "Espagne", "language": "ES",
     "city": "Casablanca", "match": "Maroc vs Espagne", "profiles": ["family", "tourist", "calm"],
     "size": 21, "capacity": 48, "meet_point": "Drop-off Anfa Nord", "meet_time": "18:05",
     "destination": "Grand Stade Hassan II - Gate D", "event_rec": "Lancement Maillot Maroc 2030",
     "mood": "Calme", "safety": "Chemin moins dense.", "route": "Marche finale via périmètre Ouest.",
     "gate": "gate-c", "verified": True, "ambiance": "calme"},

    {"id": "neutral-marrakech", "name": "Global Fans Marrakech", "team": "Neutre", "language": "EN",
     "city": "Marrakech", "match": "Argentine vs Allemagne", "profiles": ["tourist", "solo", "group"],
     "size": 34, "capacity": 52, "meet_point": "Menara Mall", "meet_time": "17:40",
     "destination": "Marrakech Medina Live", "event_rec": "Marrakech Medina Live",
     "mood": "Social", "safety": "Brief culturel et assistance tourisme.",
     "route": "Drop-off Menara puis marche sécurisée.", "gate": "gate-b", "verified": False, "ambiance": "tourisme"},
]


def compute_match_score(group: dict, fan: Fan, ticket: dict | None) -> int:
    """Score de matching entre un fan et un groupe (0-100)."""
    score = 20  # base
    if ticket:
        if group["match"] == ticket.get("title", ""): score += 20
        if group["gate"] == ticket.get("gate", ""): score += 18
        if group["city"] == ticket.get("city", ""): score += 10
    if group["team"] == fan.supported_team or group["team"] == "Neutre": score += 15
    if group["language"] == fan.language: score += 12
    if fan.fan_profile and fan.fan_profile in group["profiles"]: score += 12
    remaining = group["capacity"] - group["size"]
    if remaining > 8: score += 5
    if group["verified"]: score += 3
    return min(score, 99)


@router.get("/groups")
def list_groups(
    fan: Fan = Depends(get_current_fan),
    db: Session = Depends(get_db),
    ambiance: str | None = Query(None),
):
    """Groupes recommandés avec score de matching."""
    ticket = db.query(Ticket).filter(Ticket.fan_id == fan.id, Ticket.status == "valid").first()
    ticket_info = None
    if ticket:
        ticket_info = {"title": "Maroc vs Espagne", "gate": ticket.gate_id or "gate-c", "city": "Casablanca"}

    # Score and sort
    scored = []
    for g in GROUPS:
        s = compute_match_score(g, fan, ticket_info)
        if ambiance and g.get("ambiance") != ambiance: continue
        scored.append({**g, "score": s})
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored


@router.get("/groups/join/{group_id}")
def join_group(group_id: str, fan: Fan = Depends(get_current_fan)):
    """Rejoindre un groupe (simulé)."""
    group = next((g for g in GROUPS if g["id"] == group_id), None)
    if not group: return {"error": "Groupe introuvable"}
    return {"status": "joined", "group": group["name"], "meet_point": group["meet_point"], "meet_time": group["meet_time"]}


@router.get("/recommendations")
def get_recommendations(fan: Fan = Depends(get_current_fan)):
    """Recommandations personnalisées basées sur le profil."""
    recs = []
    if fan.supported_team == "Maroc":
        recs.append({"type": "event", "title": "Fan Zone Casablanca Corniche", "reason": "Supporters Maroc", "action": "Voir l'événement"})
        recs.append({"type": "group", "title": "Atlas Gate C", "reason": "Même équipe, même gate", "action": "Rejoindre"})
    if fan.language == "FR":
        recs.append({"type": "group", "title": "Family Ocean Route", "reason": "Francophone, ambiance famille", "action": "Rejoindre"})
    if fan.fan_profile in ("solo", "tourist"):
        recs.append({"type": "group", "title": "Morocco Welcome Crew", "reason": "Parfait pour solo/touriste", "action": "Rejoindre"})
    recs.append({"type": "event", "title": "Lancement Maillot Maroc 2030", "reason": "Événement club", "action": "Voir"})
    recs.append({"type": "post_match", "title": "After-match Casa Port", "reason": "Retour collectif", "action": "Rejoindre"})
    return recs
