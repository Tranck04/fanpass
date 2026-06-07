"""
Gate-Aware Mobility — routing vers la bonne gate.
Mapbox (carte) + OpenRouteService (itinéraires) avec zones évitées.
"""

import json
import os
import httpx
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db, SessionLocal
from models import Gate, Ticket, Fan, gen_uuid
from auth import get_current_fan

router = APIRouter(prefix="/api/mobility", tags=["mobility"])

# ─── Seed data: Gate plans ───

GATE_PLANS_SEED = {
    "gate-c": {
        "gate_id": "gate-c",
        "headline": "Route optimisée vers Gate C",
        "destination_label": "Entrée Nord — Gate C",
        "estimated_time_min": 24,
        "departure_time": "18:30",
        "gate_wait_min": 8,
        "crowd_status": "medium",
        "recommended_mode": "Tramway T2 + marche finale",
        "drop_off": "Drop-off Boulevard des Sports Nord",
        "parking": "Parking P3 Nord, 420 places",
        "final_walk": "650 m via corridor sécurisé bleu",
        "alternative_gate": "Gate D si Gate C dépasse 15 min",
        "return_plan": "Navette Nord à 22:45",
        "closed_roads": ["Avenue des Stades", "Rue Principale Sud"],
        "checkpoints": ["Checkpoint Alpha (300m)", "Contrôle sac (150m)"],
        "coordinates": {"lat": 33.5731, "lon": -7.6698},
        "dropoff_coords": {"lat": 33.5810, "lon": -7.6650},
    },
    "gate-e": {
        "gate_id": "gate-e",
        "headline": "Route supporters visiteurs vers Gate E",
        "destination_label": "Entrée Est — Gate E",
        "estimated_time_min": 31,
        "departure_time": "16:45",
        "gate_wait_min": 11,
        "crowd_status": "medium",
        "recommended_mode": "Navette Est depuis fan hub",
        "drop_off": "Drop-off Avenue Al Fath Est",
        "parking": "Parking P5 Est, accès visiteurs",
        "final_walk": "500 m via périmètre Est",
        "alternative_gate": "Gate F si Gate E saturée",
        "return_plan": "VTC zone Est après 21:30",
        "closed_roads": ["Boulevard Est", "Avenue des Supporters"],
        "checkpoints": ["Checkpoint Visiteurs (200m)"],
        "coordinates": {"lat": 34.0209, "lon": -6.8416},
        "dropoff_coords": {"lat": 34.0250, "lon": -6.8380},
    },
    "gate-b": {
        "gate_id": "gate-b",
        "headline": "Route famille et PMR vers Gate B",
        "destination_label": "Entrée Sud — Gate B",
        "estimated_time_min": 28,
        "departure_time": "19:15",
        "gate_wait_min": 6,
        "crowd_status": "low",
        "recommended_mode": "Parking P2 Sud + marche courte",
        "drop_off": "Drop-off Famille Sud",
        "parking": "Parking P2 Sud, proche ascenseurs",
        "final_walk": "380 m via corridor famille",
        "alternative_gate": "Gate A si contrôle Sud fermé",
        "return_plan": "Sortie couloir famille 23:20",
        "closed_roads": ["Avenue Sud"],
        "checkpoints": ["Accès PMR direct"],
        "coordinates": {"lat": 31.6295, "lon": -8.0086},
        "dropoff_coords": {"lat": 31.6330, "lon": -8.0050},
    },
}

TRANSPORT_MODES = [
    {"id": "taxi", "label": "Taxi / VTC", "icon": "Car"},
    {"id": "tram", "label": "Tramway", "icon": "Train"},
    {"id": "bus", "label": "Navette", "icon": "Bus"},
    {"id": "drive", "label": "Voiture", "icon": "Car"},
    {"id": "walk", "label": "Marche", "icon": "Walk"},
    {"id": "group", "label": "Groupe", "icon": "Users"},
]


def get_plan_for_gate(gate_id: str) -> dict:
    """Get the mobility plan for a specific gate, with fallback."""
    return GATE_PLANS_SEED.get(gate_id, GATE_PLANS_SEED["gate-c"])


def calculate_departure(
    kickoff_time: str,
    travel_min: int,
    walk_min: int,
    wait_min: int,
    margin_min: int = 20,
) -> str:
    """Calculate recommended departure time."""
    total = travel_min + walk_min + wait_min + margin_min
    try:
        kickoff = datetime.strptime(kickoff_time, "%H:%M")
        departure = kickoff - timedelta(minutes=total)
        return departure.strftime("%H:%M")
    except ValueError:
        total_mins = total
        h = total_mins // 60
        m = total_mins % 60
        return f"{h}h{m:02d} avant le match"


# ─── Endpoints ───

@router.get("/gate-plan")
def get_gate_plan(fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Récupérer le plan de mobilité basé sur le billet actif du fan."""
    ticket = db.query(Ticket).filter(
        Ticket.fan_id == fan.id,
        Ticket.status == "valid",
    ).first()

    gate_id = ticket.gate_id if ticket else "gate-c"
    plan = get_plan_for_gate(gate_id)

    return {
        "gate_id": gate_id,
        "ticket_title": "Maroc vs Espagne",  # TODO: query from match
        "ticket_date": "2030-06-14",
        "kickoff_time": "20:00",
        "plan": plan,
        "transport_modes": TRANSPORT_MODES,
        "departure": calculate_departure(
            "20:00",
            plan["estimated_time_min"],
            9,  # final walk
            plan["gate_wait_min"],
        ),
    }


@router.get("/gates-status")
def get_gates_status(db: Session = Depends(get_db)):
    """État en temps réel de toutes les gates."""
    gates = db.query(Gate).all()

    # Fallback seed if DB is empty
    if not gates:
        return [
            {"id": "gate-c", "code": "C", "zone": "Nord", "status": "medium", "wait_min": 8, "access": "général/VIP"},
            {"id": "gate-d", "code": "D", "zone": "Nord-Est", "status": "low", "wait_min": 5, "access": "alternatif Gate C"},
            {"id": "gate-e", "code": "E", "zone": "Est", "status": "high", "wait_min": 18, "access": "visiteurs"},
            {"id": "gate-f", "code": "F", "zone": "Ouest", "status": "closed", "wait_min": 0, "access": "logistique"},
            {"id": "gate-b", "code": "B", "zone": "Sud", "status": "low", "wait_min": 6, "access": "famille/PMR"},
            {"id": "gate-a", "code": "A", "zone": "Sud-Ouest", "status": "low", "wait_min": 4, "access": "général"},
        ]

    return [
        {
            "id": g.id,
            "code": g.gate_code,
            "zone": g.zone,
            "status": g.crowd_status,
            "wait_min": g.estimated_wait_min,
            "access": g.access_type,
        }
        for g in gates
    ]


@router.get("/alerts")
def get_alerts():
    """Alertes mobilité en temps réel."""
    return [
        {
            "id": "alert-001",
            "severity": "warning",
            "type": "road_closed",
            "title": "Avenue des Stades fermée",
            "detail": "Fermée 2h avant le coup d'envoi. Redirection par Boulevard Nord.",
            "affected_gate": "gate-c",
        },
        {
            "id": "alert-002",
            "severity": "info",
            "type": "perimeter",
            "title": "Périmètre sécurité actif",
            "detail": "Périmètre Nord accessible uniquement avec QR valide et contrôle sac.",
            "affected_gate": "gate-c",
        },
        {
            "id": "alert-003",
            "severity": "warning",
            "type": "gate_saturated",
            "title": "Gate E saturée",
            "detail": "Supporters visiteurs redirigés vers corridor Est secondaire.",
            "affected_gate": "gate-e",
        },
        {
            "id": "alert-004",
            "severity": "info",
            "type": "parking",
            "title": "Parking P3 Nord disponible",
            "detail": "420 places restantes. Accès recommandé pour Gate C.",
            "affected_gate": "gate-c",
        },
    ]


@router.post("/recalculate")
def recalculate_route(body: dict, fan: Fan = Depends(get_current_fan)):
    """Recalculer l'itinéraire si changement (route fermée, gate saturée...)."""
    gate_id = body.get("gate_id", "gate-c")
    transport_mode = body.get("transport_mode", "taxi")

    plan = get_plan_for_gate(gate_id)

    # Ajuster selon le mode de transport
    if transport_mode == "taxi":
        arrival_point = plan["drop_off"]
        walk = plan["final_walk"]
    elif transport_mode == "drive":
        arrival_point = plan["parking"]
        walk = plan["final_walk"]
    elif transport_mode == "tram":
        arrival_point = "Station Casa Port — sortie Sud"
        walk = "750 m via corridor piéton"
    elif transport_mode == "bus":
        arrival_point = "Hub navette Nord"
        walk = "500 m via accès navette"
    elif transport_mode == "walk":
        arrival_point = "Votre position"
        walk = plan["final_walk"]
    else:
        arrival_point = plan["drop_off"]
        walk = plan["final_walk"]

    return {
        "gate_id": gate_id,
        "transport_mode": transport_mode,
        "plan": plan,
        "arrival_point": arrival_point,
        "final_walk": walk,
        "closed_roads": plan["closed_roads"],
        "checkpoints": plan["checkpoints"],
        "departure": calculate_departure(
            "20:00", plan["estimated_time_min"], 9, plan["gate_wait_min"]
        ),
    }


# ─── OpenRouteService Routing ───

ORS_API_KEY = os.getenv("ORS_API_KEY", "5b3ce3597851110001cf6248")
ORS_BASE = "https://api.openrouteservice.org/v2"

# Polygon d'exclusion pour les routes fermées (Casablanca - Grand Stade)
BLOCKED_ZONES = {
    "gate-c": {
        "type": "Polygon",
        "coordinates": [[
            [-7.6720, 33.5770], [-7.6660, 33.5770],
            [-7.6660, 33.5690], [-7.6720, 33.5690],
            [-7.6720, 33.5770]
        ]]
    }
}


@router.get("/route")
async def get_ors_route(
    lat: float = Query(...),
    lon: float = Query(...),
    gate_id: str = Query("gate-c"),
):
    """Calculer un vrai itinéraire via OpenRouteService avec évitement des zones fermées."""
    plan = get_plan_for_gate(gate_id)
    dest = plan["coordinates"]
    avoid_polygon = BLOCKED_ZONES.get(gate_id)

    body = {
        "coordinates": [[lon, lat], [dest["lon"], dest["lat"]]],
        "format": "geojson",
        "radiuses": [5000, -1],
    }

    if avoid_polygon:
        body["options"] = {"avoid_polygons": {"type": "Polygon", "coordinates": avoid_polygon["coordinates"]}}

    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.post(
                f"{ORS_BASE}/directions/driving-car/geojson",
                json=body,
                headers={"Authorization": ORS_API_KEY, "Content-Type": "application/json"},
            )
            if resp.status_code == 200:
                data = resp.json()
                feature = data["features"][0] if data.get("features") else None
                if feature:
                    coords = feature["geometry"]["coordinates"]  # [[lon, lat], ...]
                    # Convert to Leaflet format [[lat, lon], ...]
                    route = [[c[1], c[0]] for c in coords]
                    dist_km = round(feature["properties"]["segments"][0]["distance"] / 1000, 1)
                    duration_min = round(feature["properties"]["segments"][0]["duration"] / 60, 1)
                    return {
                        "route": route,
                        "distance_km": dist_km,
                        "duration_min": duration_min,
                        "avoided_zones": len(plan["closed_roads"]),
                    }
            # Fallback: straight line + mock points
            mid_lat = (lat + dest["lat"]) / 2
            mid_lon = (lon + dest["lon"]) / 2
            return {
                "route": [[lat, lon], [mid_lat + 0.002, mid_lon + 0.002], [dest["lat"], dest["lon"]]],
                "distance_km": round(((lat - dest["lat"]) ** 2 + (lon - dest["lon"]) ** 2) ** 0.5 * 111, 1),
                "duration_min": plan["estimated_time_min"],
                "fallback": True,
                "avoided_zones": len(plan["closed_roads"]),
            }
        except Exception:
            return {
                "route": [[lat, lon], [dest["lat"], dest["lon"]]],
                "distance_km": 5.2,
                "duration_min": plan["estimated_time_min"],
                "fallback": True,
                "avoided_zones": len(plan["closed_roads"]),
            }
    }
