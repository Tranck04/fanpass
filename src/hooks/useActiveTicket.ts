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
  if (gate.startsWith("gate-")) return `Gate ${gate.replace("gate-", "").toUpperCase()}`;
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
  if (typeof window 