"""Merchandising — produits contextualisés, retrait gate/fan zone/event."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Fan, Order, Ticket
from auth import get_current_fan

router = APIRouter(prefix="/api/merch", tags=["merch"])

PRODUCTS = [
    {"id": "maroc-home", "name": "Maillot Maroc 2030 Home", "category": "official", "team": "Maroc",
     "match_tag": "Maroc vs Espagne", "price": 790, "rating": 4.9, "stock": 84, "badge": "Officiel",
     "promo": "15% avec billet Gate C", "pickup": ["stadium", "fan_zone", "event"],
     "visual": {"label": "MAR", "from": "#C8102E", "to": "#006233"}},
    {"id": "scarf-opening", "name": "Écharpe Maroc vs Espagne", "category": "souvenir", "team": "Maroc",
     "match_tag": "Maroc vs Espagne", "price": 220, "rating": 4.8, "stock": 62, "badge": "Match-day",
     "promo": "Retrait express avant coup d'envoi", "pickup": ["stadium", "fan_zone"],
     "visual": {"label": "M/E", "from": "#D92332", "to": "#0D1F3C"}},
    {"id": "corniche-pack", "name": "Pack Casablanca Corniche", "category": "sponsor", "team": "FanPass",
     "event_tag": "Casablanca Corniche", "price": 360, "rating": 4.7, "stock": 51, "badge": "Sponsor",
     "promo": "Boisson + badge + tote bag", "pickup": ["fan_zone"],
     "visual": {"label": "CFC", "from": "#1A6FE8", "to": "#00C48C"}},
    {"id": "cap-gate-c", "name": "Casquette Atlas Gate C", "category": "official", "team": "Maroc",
     "match_tag": "Maroc vs Espagne", "price": 280, "rating": 4.6, "stock": 39, "badge": "Gate C",
     "promo": "Disponible au point retrait Nord", "pickup": ["stadium"],
     "visual": {"label": "GC", "from": "#0D1F3C", "to": "#1A6FE8"}},
    {"id": "wydad-heritage", "name": "Wydad Heritage 2031", "category": "club", "team": "Wydad AC",
     "price": 640, "rating": 4.8, "stock": 44, "badge": "Club", "promo": "Précommande club partenaire",
     "pickup": ["event", "stadium"], "visual": {"label": "WAC", "from": "#B80F1C", "to": "#F6F6F6"}},
    {"id": "raja-drop", "name": "Raja Streetwear Drop", "category": "club", "team": "Raja CA",
     "price": 590, "rating": 4.7, "stock": 37, "badge": "Club", "promo": "Drop limité",
     "pickup": ["event", "fan_zone"], "visual": {"label": "RCA", "from": "#00843D", "to": "#111827"}},
    {"id": "babouche", "name": "Babouche Supporter Edition", "category": "local", "team": "Artisans Maroc",
     "price": 310, "rating": 4.9, "stock": 29, "badge": "Local", "promo": "Fait main, retrait event",
     "pickup": ["event", "fan_zone"], "visual": {"label": "ART", "from": "#C17C2C", "to": "#006D77"}},
    {"id": "ceramic-mug", "name": "Mug Céramique Morocco 2030", "category": "local", "team": "Safialab",
     "price": 180, "rating": 4.5, "stock": 73, "badge": "Souvenir", "promo": "Offre duo fan zone",
     "pickup": ["fan_zone", "event"], "visual": {"label": "2030", "from": "#FFFFFF", "to": "#1A6FE8"}},
]

FILTERS = ["all", "match", "official", "club", "local", "sponsor"]
PICKUPS = {"stadium": "Stade", "fan_zone": "Fan zone", "event": "Event"}


@router.get("")
def list_products(
    fan: Fan = Depends(get_current_fan),
    db: Session = Depends(get_db),
    filter: str = "all",
):
    """Catalogue avec recommandations contextualisées."""
    ticket = db.query(Ticket).filter(Ticket.fan_id == fan.id, Ticket.status == "valid").first()
    match_title = "Maroc vs Espagne"
    active_gate = ticket.gate_id if ticket else "gate-c"

    result = PRODUCTS
    if filter == "match":
        result = [p for p in result if p.get("match_tag") == match_title or p["team"] == fan.supported_team]
    elif filter == "club":
        result = [p for p in result if p["category"] == "club"]
    elif filter != "all":
        result = [p for p in result if p["category"] == filter]

    return {
        "match_title": match_title,
        "active_gate": active_gate.replace("gate-", "Gate "),
        "products": result,
        "pickup_options": PICKUPS,
    }


@router.post("/order")
def place_order(body: dict, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Simuler une commande avec validation serveur."""
    items = body.get("items", [])
    pickup = body.get("pickup", "stadium")
    if pickup not in PICKUPS:
        raise HTTPException(400, "Mode de retrait invalide")
    if not isinstance(items, list) or not items:
        raise HTTPException(400, "Panier vide")

    products_by_id = {p["id"]: p for p in PRODUCTS}
    total = 0
    validated_items = []

    for item in items:
        if not isinstance(item, dict):
            raise HTTPException(400, "Article invalide")
        product = products_by_id.get(item.get("id"))
        if not product:
            raise HTTPException(400, "Produit introuvable")
        try:
            qty = int(item.get("qty", 0))
        except (TypeError, ValueError):
            raise HTTPException(400, "Quantite invalide")
        if qty < 1 or qty > 9:
            raise HTTPException(400, "Quantite invalide")
        if qty > product["stock"]:
            raise HTTPException(400, "Stock insuffisant")
        if pickup not in product["pickup"]:
            raise HTTPException(400, f"Retrait {PICKUPS[pickup]} indisponible pour {product['name']}")
        total += product["price"] * qty
        validated_items.append({
            "id": product["id"],
            "name": product["name"],
            "qty": qty,
            "unit_price": product["price"],
        })

    order = Order(
        fan_id=fan.id,
        status="confirmed",
        total_mad=total,
        pickup_type=pickup,
        pickup_location="Stand Merch C2 - a 2 min de votre gate"
        if pickup == "stadium"
        else "Fan Zone - comptoir principal",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    order_id = f"MCH-{order.id[:8].upper()}"
    return {
        "order_id": order_id,
        "status": "confirmed",
        "total_mad": total,
        "items": validated_items,
        "pickup": PICKUPS.get(pickup, "Stade"),
        "pickup_location": order.pickup_location,
        "qr_code": f"QR-MCH-{order_id}",
        "available_at": "18:30",
    }
