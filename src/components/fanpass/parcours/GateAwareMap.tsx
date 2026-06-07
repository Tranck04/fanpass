import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const gateIcon = new L.DivIcon({
  html: `<div style="background:#1A6FE8;color:white;padding:4px 8px;border-radius:8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 0 20px rgba(26,111,232,0.5)">Gate</div>`,
  iconSize: [60, 24],
  iconAnchor: [30, 12],
});
const userIcon = new L.DivIcon({
  html: `<div style="background:#00C48C;color:white;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 16px rgba(0,196,140,0.6)"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});
const dropoffIcon = new L.DivIcon({
  html: `<div style="background:#F97316;color:white;padding:2px 6px;border-radius:6px;font-size:10px;font-weight:600;white-space:nowrap">Drop-off</div>`,
  iconSize: [60, 20],
  iconAnchor: [30, 10],
});

type GatePlanCoords = {
  gate_id?: string;
  coordinates: { lat: number; lon: number };
  dropoff_coords: { lat: number; lon: number };
  closed_roads: string[];
  checkpoints: string[];
};
type Props = { plan: GatePlanCoords; gateCode: string };

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);
  return null;
}

async function fetchOSRMRoute(
  from: [number, number],
  to: [number, number],
): Promise<[number, number][] | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?geometries=geojson&overview=full`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) {
      const data = await res.json();
      if (data.routes?.length > 0)
        return data.routes[0].geometry.coordinates.map((c: number[]) => [
          c[1],
          c[0],
        ]);
    }
  } catch {}
  return null;
}

export function GateAwareMap({ plan, gateCode }: Props) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [routeInfo, setRouteInfo] = useState("");
  const fetchingRef = useRef(false);

  const dest: [number, number] = [plan.coordinates.lat, plan.coordinates.lon];
  const dropoff: [number, number] = [
    plan.dropoff_coords.lat,
    plan.dropoff_coords.lon,
  ];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
        () => setUserPos([dropoff[0] + 0.02, dropoff[1] - 0.02]),
        { enableHighAccuracy: true, timeout: 8000 },
      );
    } else setUserPos([dropoff[0] + 0.02, dropoff[1] - 0.02]);
  }, [plan]);

  // Fetch route once — no flashing, no straight-line fallback
  useEffect(() => {
    if (!userPos || fetchingRef.current) return;
    fetchingRef.current = true;
    let cancelled = false;

    (async () => {
      setRoute(null);
      setRouteInfo("Calcul...");
      const seg1 = await fetchOSRMRoute(userPos, dropoff);
      if (cancelled || !seg1) {
        if (!cancelled) setRouteInfo("OSRM indisponible");
        fetchingRef.current = false;
        return;
      }
      const seg2 = await fetchOSRMRoute(dropoff, dest);
      if (cancelled || !seg2) {
        if (!cancelled) setRouteInfo("OSRM indisponible");
        fetchingRef.current = false;
        return;
      }
      const combined = [...seg1, ...seg2.slice(1)];
      if (!cancelled) {
        setRoute(combined);
        setRouteInfo(`${(combined.length * 0.03).toFixed(1)} km · OSRM`);
        fetchingRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
      fetchingRef.current = false;
    };
  }, [userPos]);

  const center: [number, number] = userPos ?? dropoff;
  const bounds = userPos
    ? L.latLngBounds([userPos, dest])
    : L.latLngBounds([dropoff, dest]);

  return (
    <div className="relative mt-4 h-80 overflow-hidden rounded-2xl border border-white/5">
      <MapContainer
        center={center}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <FitBounds bounds={bounds} />
        <Marker position={dest} icon={gateIcon}>
          <Popup>Gate {gateCode}</Popup>
        </Marker>
        <Marker position={dropoff} icon={dropoffIcon}>
          <Popup>Drop-off</Popup>
        </Marker>
        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>Vous</Popup>
          </Marker>
        )}
        {route && route.length >= 2 && (
          <Polyline
            positions={route}
            pathOptions={{ color: "#1A6FE8", weight: 4, opacity: 0.8 }}
          />
        )}
      </MapContainer>
      <div className="glass absolute bottom-3 left-3 rounded-lg px-2 py-1 text-xs z-[1000]">
        {userPos ? "Vous" : "Pos. approx."}
      </div>
      <div className="absolute left-3 top-3 rounded-lg bg-destructive/20 px-2 py-1 text-xs text-destructive z-[1000]">
        {plan.closed_roads.length} routes fermées
      </div>
      <div className="glass absolute right-3 top-3 rounded-lg px-2 py-1 text-xs z-[1000]">
        Gate {gateCode}
      </div>
      {routeInfo && (
        <div className="absolute bottom-3 right-3 rounded-lg bg-primary/15 px-2 py-1 text-xs text-primary-glow z-[1000]">
          {routeInfo}
        </div>
      )}
    </div>
  );
}
