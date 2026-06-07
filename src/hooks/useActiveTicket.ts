import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fanpassFetch } from "@/lib/fanpass-api";
import type { ActiveTicket } from "@/lib/types";

const TICKETS_STORAGE_KEY = "fanpass:purchasedTickets:v1";

const DEFAULT_TICKET: ActiveTicket = {
  title: "Maroc vs Espagne",
  city: "Casablanca",
  venue: "Grand Stade Hassan II",
  date: "14 juin 2030",
  time: "20:00",
  gate: "Gate C",
};

type ApiTicket = {
  title?: string;
  ticket_title?: string;
  city?: string;
  venue?: string;
  date?: string;
  time?: string;
  gate?: string;
  gate_id?: string;
};

function formatGate(gate?: string) {
  if (!gate) return DEFAULT_TICKET.gate;
  if (gate.startsWith("Gate ")) return gate;
  if (gate.startsWith("gate-"))
    return `Gate ${gate.replace("gate-", "").toUpperCase()}`;
  return gate;
}

function mapApiTicket(ticket: ApiTicket): ActiveTicket {
  return {
    title: ticket.title ?? ticket.ticket_title ?? DEFAULT_TICKET.title,
    city: ticket.city ?? DEFAULT_TICKET.city,
    venue: ticket.venue ?? DEFAULT_TICKET.venue,
    date: ticket.date ?? DEFAULT_TICKET.date,
    time: ticket.time ?? DEFAULT_TICKET.time,
    gate: formatGate(ticket.gate ?? ticket.gate_id),
  };
}

function readActiveTicket(): ActiveTicket {
  if (typeof window === "undefined") return DEFAULT_TICKET;
  try {
    const raw = window.localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!raw) return DEFAULT_TICKET;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed[0]) return DEFAULT_TICKET;
    return {
      ...DEFAULT_TICKET,
      title: parsed[0].title ?? DEFAULT_TICKET.title,
      city: parsed[0].city ?? DEFAULT_TICKET.city,
      venue: parsed[0].venue ?? DEFAULT_TICKET.venue,
      date: parsed[0].date ?? DEFAULT_TICKET.date,
      time: parsed[0].time ?? DEFAULT_TICKET.time,
      gate: parsed[0].gate ?? DEFAULT_TICKET.gate,
    };
  } catch {
    return DEFAULT_TICKET;
  }
}

export function useActiveTicket() {
  const { token } = useAuth();
  const [ticket, setTicket] = useState<ActiveTicket>(DEFAULT_TICKET);

  useEffect(() => {
    setTicket(readActiveTicket());
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const response = await fanpassFetch("/tickets", token, {
          signal: AbortSignal.timeout(3000),
        });
        if (!response.ok) return;
        const tickets = await response.json();
        if (!cancelled && Array.isArray(tickets) && tickets[0]) {
          setTicket(mapApiTicket(tickets[0]));
        }
      } catch {
        // Keep local/default ticket if the API is unavailable.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return ticket;
}
