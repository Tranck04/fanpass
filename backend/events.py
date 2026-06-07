"""Fan Events — catalogue d'événements enrichissant l'expérience supporter."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Fan, Ticket
from auth import get_current_fan

router = APIRouter(prefix="/api/events", tags=["events"])

EVENTS = [
    {"id": "casa-corniche", "category": "fan_zone", "title": "Casablanca Corniche",
     "subtitle": "Fan zone officielle", "city": "Casablanca", "venue": "Corniche Ain Diab",
     "date": "14 juin 2030", "time": "16:00 - 01:00", "price": "Gratuit (réservation)",
     "capacity": 82, "safety": "Dense", "is_official": True, "verified": True,
     "description": "Écran géant, DJ live, food court et zone sponsors. Fan zone officielle de la Coupe du Monde.",
     "program": ["16:00 ouverture", "18:30 show supporters", "22:15 DJ post-match"],
     "partners": ["ONMT", "Maroc Telecom", "Coca-Cola"], "merch": "Écharpe Maroc 2030 - retrait sur place",
     "route": "Tram Casa Port + navette Corniche", "team": "Maroc", "ambiance": "festive",
     "languages": ["FR", "AR", "EN"], "linked_match": "Maroc vs Espagne"},

    {"id": "marrakech-medina", "category": "fan_zone", "title": "Marrakech Medina Live",
     "subtitle": "Football, concerts et artisans", "city": "Marrakech", "venue": "Esplanade Menara",
     "date": "4 juillet 2030", "time": "15:00 - 00:30", "price": "À partir de 180 MAD",
     "capacity": 68, "safety": "Controle", "is_official": True, "verified": True,
     "description": "Fan zone mêlant football mondial, culture marocaine et concerts.",
     "program": ["15:00 village artisans", "18:00 concert Gnawa", "23:00 after match"],
     "partners": ["Visit Marrakech", "Royal Air Maroc"], "merch": "Pack souvenir Menara",
     "route": "Drop-off Menara puis marche sécurisée", "team": "Neutre", "ambiance": "culturelle",
     "languages": ["FR", "EN", "AR"], "linked_match": "Argentine vs Allemagne"},

    {"id": "rabat-ocean", "category": "watch_party", "title": "Rabat Ocean Stage",
     "subtitle": "Familles, food court, live stats", "city": "Rabat", "venue": "Bouregreg Fan Park",
     "date": "18 juin 2030", "time": "14:00 - 23:30", "price": "À partir de 160 MAD",
     "capacity": 46, "safety": "Calme", "is_official": False, "verified": True,
     "description": "Événement famille avec zone assise, stats live et animations enfants.",
     "program": ["14:00 ouverture famille", "17:30 quiz football", "20:15 highlights"],
     "partners": ["Bouregreg Marina", "Decathlon"], "merch": "Maillot enfant - offre famille",
     "route": "Parking Marina + entrée Family", "team": "Neutre", "ambiance": "famille",
     "languages": ["FR", "AR"], "linked_match": "France vs Bresil"},

    {"id": "jersey-launch", "category": "club_event", "title": "Lancement Maillot Maroc 2030",
     "subtitle": "Showcase officiel et précommande", "city": "Casablanca", "venue": "FanPass Arena Pop-up",
     "date": "13 juin 2030", "time": "19:00 - 22:00", "price": "À partir de 120 MAD",
     "capacity": 54, "safety": "Controle", "is_official": True, "verified": True,
     "description": "Révélation du maillot officiel, rencontre légendes et précommande exclusive.",
     "program": ["19:00 reveal maillot", "20:00 rencontre légendes", "21:00 précommande"],
     "partners": ["FRMF", "Puma", "Artisans Maroc"], "merch": "Réduction 15% sur précommande",
     "route": "Taxi/VTC partenaire recommandé", "team": "Maroc", "ambiance": "premium",
     "languages": ["FR", "AR"], "linked_match": "Maroc vs Espagne"},

    {"id": "sponsor-skills", "category": "sponsor", "title": "Skills Challenge Atlas",
     "subtitle": "Activation sponsor et mini-tournoi", "city": "Casablanca", "venue": "Village Sponsors Nord",
     "date": "14 juin 2030", "time": "12:00 - 18:30", "price": "Pass événement requis",
     "capacity": 61, "safety": "Controle", "is_official": False, "verified": True,
     "description": "Défis football, mini-tournoi communautaire et lots partenaires.",
     "program": ["12:00 inscriptions", "14:00 tournoi", "17:30 remise des lots"],
     "partners": ["Adidas", "Orange", "CAF"], "merch": "Ballon collector sponsor",
     "route": "Accessible depuis corridor Nord", "team": "Neutre", "ambiance": "festive",
     "languages": ["FR", "EN", "AR"], "linked_match": "Maroc vs Espagne"},

    {"id": "supporters-meetup", "category": "community", "title": "Meet-up Supporters Atlas",
     "subtitle": "Point de rencontre avant stade", "city": "Rabat", "venue": "Place Al Barid",
     "date": "18 juin 2030", "time": "15:30 - 17:00", "price": "Gratuit",
     "capacity": 38, "safety": "Calme", "is_official": False, "verified": False,
     "description": "Groupe temporaire pour rejoindre le stade avec des fans de la même équipe.",
     "program": ["15:30 check-in", "16:15 chants supporters", "17:00 départ groupe"],
     "partners": ["Tram Rabat", "Fan Embassy"], "merch": "Badge groupe offert",
     "route": "Départ collectif vers Gate E", "team": "Neutre", "ambiance": "sociale",
     "languages": ["FR", "EN"], "linked_match": "France vs Bresil"},
]

FILTERS = [
    {"id": "all", "label": "Tous"},
    {"id": "fan_zone", "label": "Fan Zones"},
    {"id": "watch_party", "label": "Watch"},
    {"id": "sponsor", "label": "Sponsors"},
    {"id": "club_event", "label": "Club"},
    {"id": "community", "label": "Communauté"},
]


@router.get("")
def list_events(
    fan: Fan = Depends(get_current_fan),
    category: str | None = Query(None),
    ambiance: str | None = Query(None),
    team: str | None = Query(None),
):
    """Catalogue des événements avec filtres."""
    result = EVENTS
    if category and category != "all":
        result = [e for e in result if e["category"] == category]
    if ambiance:
        result = [e for e in result if e["ambiance"] == ambiance]
    if team:
        result = [e for e in result if e["team"] == team or e["team"] == "Neutre"]
    # Sort: official/verified first, then by capacity
    result.sort(key=lambda e: (not e["is_official"], not e["verified"], -e["capacity"]))
    return result


@router.get("/{event_id}")
def get_event(event_id: str):
    """Détail d'un événement."""
    event = next((e for e in EVENTS if e["id"] == event_id), None)
    if not event:
        return {"error": "Événement introuvable"}
    return event


@router.get("/{event_id}/reserve")
def reserve_event(event_id: str, fan: Fan = Depends(get_current_fan)):
    """Réserver une place (simulation)."""
    event = next((e for e in EVENTS if e["id"] == event_id), None)
    if not event:
        return {"error": "Événement introuvable"}
    return {"status": "reserved", "event": event["title"], "qr": f"QR-EVT-{event_id[:6].upper()}"}
