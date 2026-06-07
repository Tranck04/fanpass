-- ============================================================
-- FANPASS — Database Schema v2 (corrigé)
-- Couvre tous les modules frontend :
--   🎫 Billet, 🗺️ Parcours, 👥 Communauté, ⋯ Plus
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CORE ENTITIES
-- ============================================================

CREATE TABLE fan (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name            VARCHAR(100) NOT NULL,
    last_name             VARCHAR(100) NOT NULL,
    email                 VARCHAR(255) NOT NULL UNIQUE,
    phone                 VARCHAR(30),
    nationality           VARCHAR(100),
    language              VARCHAR(10) DEFAULT 'fr'
                              CHECK (language IN ('fr', 'en', 'es', 'ar')),
    supported_team        VARCHAR(100),
    fan_profile           VARCHAR(20) DEFAULT 'solo'
                              CHECK (fan_profile IN ('solo', 'family', 'tourist', 'local', 'group', 'calm')),
    fan_id_token          VARCHAR(512) UNIQUE,
    fan_id_status         VARCHAR(20) NOT NULL DEFAULT 'pending'
                              CHECK (fan_id_status IN ('pending', 'verified', 'rejected', 'expired')),
    document_type         VARCHAR(30)
                              CHECK (document_type IN ('passport', 'id_card', 'residence_permit')),
    document_number       VARCHAR(100),
    document_verified_at  TIMESTAMP,
    created_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE stadium (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(200) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    address     TEXT,
    latitude    DECIMAL(9,6) NOT NULL,
    longitude   DECIMAL(9,6) NOT NULL,
    capacity    INTEGER
);

CREATE TABLE gate (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stadium_id          UUID NOT NULL REFERENCES stadium(id) ON DELETE CASCADE,
    gate_code           VARCHAR(20) NOT NULL,
    zone                VARCHAR(50),
    access_type         VARCHAR(30) DEFAULT 'general'
                            CHECK (access_type IN ('general', 'vip', 'pmr', 'family', 'away_fans')),
    crowd_status        VARCHAR(20) NOT NULL DEFAULT 'low'
                            CHECK (crowd_status IN ('low', 'medium', 'high', 'closed')),
    estimated_wait_min  INTEGER DEFAULT 0,
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (stadium_id, gate_code)
);

CREATE TABLE match (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stadium_id     UUID NOT NULL REFERENCES stadium(id),
    team_home      VARCHAR(100) NOT NULL,
    team_away      VARCHAR(100) NOT NULL,
    match_date     DATE NOT NULL,
    kickoff_time   TIME NOT NULL,
    championship   VARCHAR(100) NOT NULL,
    season         VARCHAR(20),
    status         VARCHAR(20) NOT NULL DEFAULT 'scheduled'
                       CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled'))
);

-- ============================================================
-- EVENTS (fan zones, concerts, watch parties, etc.)
-- Catégories alignées avec le frontend
-- ============================================================

CREATE TABLE event (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stadium_id      UUID REFERENCES stadium(id),
    match_id        UUID REFERENCES match(id),
    name            VARCHAR(200) NOT NULL,
    category        VARCHAR(50) NOT NULL
                        CHECK (category IN ('official', 'watch', 'sponsor', 'club', 'family')),
    location_label  VARCHAR(255),
    latitude        DECIMAL(9,6),
    longitude       DECIMAL(9,6),
    start_time      TIME,
    end_time        TIME,
    density         VARCHAR(20) DEFAULT 'Calme'
                        CHECK (density IN ('Calme', 'Controle', 'Dense')),
    capacity_pct    INTEGER DEFAULT 50 CHECK (capacity_pct BETWEEN 0 AND 100),
    description     TEXT,
    program         TEXT[],     -- e.g. ARRAY['16:00 ouverture', '18:30 show']
    partners        TEXT[],     -- e.g. ARRAY['ONMT', 'Coca-Cola']
    merch_offer     VARCHAR(255),
    route_hint      VARCHAR(255),
    is_official     BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================
-- TICKETING — Supporte matchs + events + fan zones
-- ============================================================

CREATE TABLE ticket_tier (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type      VARCHAR(20) NOT NULL
                        CHECK (event_type IN ('match', 'fan_zone', 'event')),
    event_id        UUID,   -- FK vers match(id) OU event(id) selon event_type
    name            VARCHAR(50) NOT NULL,   -- "Standard", "Premium", "Atlas VIP"
    price_mad       INTEGER NOT NULL CHECK (price_mad >= 0),
    benefits        TEXT[],                 -- e.g. ARRAY['Siège assigné', 'QR sécurisé']
    UNIQUE (event_type, event_id, name)
);

CREATE TABLE ticket (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id          UUID NOT NULL REFERENCES fan(id) ON DELETE RESTRICT,
    match_id        UUID REFERENCES match(id) ON DELETE RESTRICT,
    event_id        UUID REFERENCES event(id) ON DELETE RESTRICT,
    gate_id         UUID NOT NULL REFERENCES gate(id) ON DELETE RESTRICT,
    tier_id         UUID REFERENCES ticket_tier(id),
    seat_section    VARCHAR(50),
    seat_row        VARCHAR(10),
    seat_number     VARCHAR(10),
    qr_payload      TEXT NOT NULL,
    qr_signature    TEXT NOT NULL,
    security_code   VARCHAR(50),            -- ex: "FP-2030-C-ATLAS"
    access_zone     VARCHAR(100),
    tribune         VARCHAR(100),
    access_control  VARCHAR(255),
    access_rules    TEXT[],
    status          VARCHAR(20) NOT NULL DEFAULT 'valid'
                        CHECK (status IN ('valid', 'scanned', 'cancelled', 'expired', 'transferred')),
    issued_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMP NOT NULL,
    scanned_at      TIMESTAMP,

    -- Un ticket est soit pour un match, soit pour un event
    CONSTRAINT ticket_target_check CHECK (
        (match_id IS NOT NULL AND event_id IS NULL) OR
        (match_id IS NULL AND event_id IS NOT NULL)
    )
);

-- Historique d'achat de billets
CREATE TABLE ticket_purchase (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id          UUID NOT NULL REFERENCES fan(id) ON DELETE RESTRICT,
    ticket_id       UUID NOT NULL REFERENCES ticket(id) ON DELETE RESTRICT,
    tier_name       VARCHAR(50) NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price_mad  INTEGER NOT NULL CHECK (unit_price_mad >= 0),
    total_mad       INTEGER NOT NULL CHECK (total_mad >= 0),
    purchased_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MOBILITY & ITINERARY
-- ============================================================

CREATE TABLE itinerary (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id                UUID NOT NULL REFERENCES fan(id) ON DELETE CASCADE,
    ticket_id             UUID REFERENCES ticket(id) ON DELETE CASCADE,
    recommended_gate_id   UUID REFERENCES gate(id),
    transport_mode        VARCHAR(30) NOT NULL DEFAULT 'transit'
                              CHECK (transport_mode IN ('transit', 'walk', 'taxi', 'drive', 'mixed')),
    departure_point       VARCHAR(255),
    duration_min          INTEGER,
    crowd_level           VARCHAR(20) DEFAULT 'low'
                              CHECK (crowd_level IN ('low', 'medium', 'high')),
    generated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE itinerary_step (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_id    UUID NOT NULL REFERENCES itinerary(id) ON DELETE CASCADE,
    step_order      INTEGER NOT NULL,
    instruction     TEXT NOT NULL,
    transport_type  VARCHAR(30)
                        CHECK (transport_type IN ('walk', 'tram', 'bus', 'taxi', 'train', 'metro')),
    duration_min    INTEGER,
    UNIQUE (itinerary_id, step_order)
);

-- Plans de gate préconfigurés (itinéraires types par gate)
CREATE TABLE gate_plan (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gate_id             UUID NOT NULL REFERENCES gate(id) ON DELETE CASCADE UNIQUE,
    headline            VARCHAR(255),
    destination_label   VARCHAR(255),
    estimated_time_min  INTEGER,
    departure_time      TIME,
    gate_wait_min       INTEGER,
    recommended_mode    VARCHAR(255),
    drop_off            VARCHAR(255),
    parking             VARCHAR(255),
    final_walk          VARCHAR(255),
    alternative_gate    VARCHAR(255),
    return_plan         VARCHAR(255)
);

-- ============================================================
-- COMMUNITY & MATCHING — Groupes de fans nommés
-- ============================================================

CREATE TABLE fan_group (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                    VARCHAR(100) NOT NULL,
    match_id                UUID NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    team                    VARCHAR(100) NOT NULL,
    language                VARCHAR(10) NOT NULL
                                CHECK (language IN ('fr', 'en', 'es', 'ar')),
    capacity                INTEGER NOT NULL DEFAULT 50 CHECK (capacity > 0),
    mood                    VARCHAR(20) DEFAULT 'Social'
                                CHECK (mood IN ('Calme', 'Social', 'Famille', 'Intense')),
    meet_point              VARCHAR(255),
    meet_time               TIME,
    destination             VARCHAR(255),
    event_recommendation    VARCHAR(255),
    safety_note             TEXT,
    route_note              TEXT,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE fan_group_member (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id        UUID NOT NULL REFERENCES fan_group(id) ON DELETE CASCADE,
    fan_id          UUID NOT NULL REFERENCES fan(id) ON DELETE CASCADE,
    joined_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (group_id, fan_id)
);

-- Lien fan-match pour le matching (reste utile pour le matching individuel)
CREATE TABLE fan_match_community (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id         UUID NOT NULL REFERENCES fan(id) ON DELETE CASCADE,
    match_id       UUID NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    is_visible     BOOLEAN NOT NULL DEFAULT TRUE,
    meeting_point  VARCHAR(255),
    joined_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (fan_id, match_id)
);

-- ============================================================
-- MERCHANDISING — Catégories alignées avec le frontend
-- ============================================================

CREATE TABLE product (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         VARCHAR(200) NOT NULL,
    category     VARCHAR(50) NOT NULL
                     CHECK (category IN ('official', 'club', 'souvenir', 'local', 'sponsor', 'post2030')),
    description  TEXT,
    team         VARCHAR(100),
    match_tag    VARCHAR(200),
    event_tag    VARCHAR(200),
    badge        VARCHAR(50),
    promo        VARCHAR(255),
    price_mad    INTEGER NOT NULL CHECK (price_mad >= 0),
    stock        INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    rating       DECIMAL(2,1) DEFAULT 5.0 CHECK (rating BETWEEN 0 AND 5),
    pickup       VARCHAR(20)[] DEFAULT ARRAY['stadium']
                     CHECK (pickup <@ ARRAY['stadium', 'fan_zone', 'event']::VARCHAR[]),
    image_url    TEXT,
    is_available  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "order" (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id           UUID NOT NULL REFERENCES fan(id) ON DELETE RESTRICT,
    status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'confirmed', 'ready', 'collected', 'cancelled')),
    total_mad        INTEGER NOT NULL CHECK (total_mad >= 0),
    pickup_type      VARCHAR(20) DEFAULT 'stadium'
                         CHECK (pickup_type IN ('stadium', 'fan_zone', 'event')),
    pickup_location  VARCHAR(255),
    ordered_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_item (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id       UUID NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    product_id     UUID NOT NULL REFERENCES product(id) ON DELETE RESTRICT,
    quantity       INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price_mad INTEGER NOT NULL CHECK (unit_price_mad >= 0)
);

-- ============================================================
-- PARTNER SERVICES — VTC, hôtels, restos, tourisme, packs
-- ============================================================

CREATE TABLE partner_service (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category        VARCHAR(30) NOT NULL
                        CHECK (category IN ('mobility', 'stay', 'food', 'tourism', 'experience', 'premium')),
    name            VARCHAR(200) NOT NULL,
    partner         VARCHAR(200),
    city            VARCHAR(100) NOT NULL,
    journey_step    VARCHAR(20) NOT NULL
                        CHECK (journey_step IN ('pre_match', 'to_gate', 'post_match', 'fan_zone')),
    price_label     VARCHAR(100),           -- "À partir de 95 MAD", "Menu 160 MAD"
    rating          DECIMAL(2,1) DEFAULT 4.0,
    eta_label       VARCHAR(100),           -- "8 min", "Départ 17:25"
    distance_label  VARCHAR(100),           -- "Drop-off Nord", "4.2 km stade"
    match_tag       VARCHAR(200),
    gate_tag        VARCHAR(20),
    linked_event    VARCHAR(200),
    benefit         TEXT,
    detail          TEXT,
    restrictions    TEXT[],
    pickup_hint     VARCHAR(255),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE partner_booking (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id          UUID NOT NULL REFERENCES fan(id) ON DELETE RESTRICT,
    service_id      UUID NOT NULL REFERENCES partner_service(id) ON DELETE RESTRICT,
    ticket_id       UUID REFERENCES ticket(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'reserved'
                        CHECK (status IN ('reserved', 'ready', 'completed', 'cancelled')),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SAFETY & ASSISTANCE
-- ============================================================

CREATE TABLE emergency_contact (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       VARCHAR(100) NOT NULL,
    value       VARCHAR(50) NOT NULL,       -- "19", "SOS FanPass"
    detail      VARCHAR(255),
    tone        VARCHAR(20) NOT NULL DEFAULT 'info'
                    CHECK (tone IN ('info', 'warning', 'critical', 'success')),
    sort_order  INTEGER DEFAULT 0
);

CREATE TABLE safety_place (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type        VARCHAR(30) NOT NULL
                    CHECK (type IN ('hospital', 'pharmacy', 'police', 'tourism')),
    name        VARCHAR(200) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    distance    VARCHAR(50),                -- "850 m"
    eta         VARCHAR(50),                -- "7 min"
    open_hours  VARCHAR(100),              -- "24/7", "Jusqu'à 01:00"
    detail      TEXT,
    latitude    DECIMAL(9,6),
    longitude   DECIMAL(9,6)
);

CREATE TABLE official_alert (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    severity    VARCHAR(20) NOT NULL DEFAULT 'info'
                    CHECK (severity IN ('info', 'warning', 'critical')),
    title       VARCHAR(200) NOT NULL,
    detail      TEXT,
    gate_id     UUID REFERENCES gate(id),
    match_id    UUID REFERENCES match(id),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMP
);

CREATE TABLE support_request (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id          UUID NOT NULL REFERENCES fan(id) ON DELETE CASCADE,
    ticket_id       UUID REFERENCES ticket(id),
    type            VARCHAR(30) NOT NULL
                        CHECK (type IN ('emergency', 'medical', 'ticket', 'lost', 'tourism', 'incident')),
    title           VARCHAR(200),
    status          VARCHAR(20) NOT NULL DEFAULT 'open'
                        CHECK (status IN ('open', 'triage', 'resolved')),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at     TIMESTAMP
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Fan lookups
CREATE INDEX idx_fan_email           ON fan(email);
CREATE INDEX idx_fan_fan_id_token    ON fan(fan_id_token);
CREATE INDEX idx_fan_fan_id_status   ON fan(fan_id_status);
CREATE INDEX idx_fan_profile         ON fan(fan_profile);

-- Ticket validation (hot path)
CREATE INDEX idx_ticket_fan_id       ON ticket(fan_id);
CREATE INDEX idx_ticket_match_id     ON ticket(match_id);
CREATE INDEX idx_ticket_event_id     ON ticket(event_id);
CREATE INDEX idx_ticket_status       ON ticket(status);
CREATE INDEX idx_ticket_qr_signature ON ticket(qr_signature);

-- Ticket purchase
CREATE INDEX idx_ticket_purchase_fan ON ticket_purchase(fan_id);

-- Gate crowd monitoring
CREATE INDEX idx_gate_stadium_id     ON gate(stadium_id);
CREATE INDEX idx_gate_crowd_status   ON gate(crowd_status);

-- Match schedule
CREATE INDEX idx_match_date          ON match(match_date);
CREATE INDEX idx_match_stadium_id    ON match(stadium_id);
CREATE INDEX idx_match_status        ON match(status);

-- Itinerary
CREATE INDEX idx_itinerary_fan_match ON itinerary(fan_id, ticket_id);
CREATE INDEX idx_itinerary_step_ord  ON itinerary_step(itinerary_id, step_order);

-- Fan groups
CREATE INDEX idx_fan_group_match     ON fan_group(match_id);
CREATE INDEX idx_fan_group_team      ON fan_group(team);
CREATE INDEX idx_group_member_fan    ON fan_group_member(fan_id);

-- Community
CREATE INDEX idx_community_match     ON fan_match_community(match_id);

-- Events
CREATE INDEX idx_event_match_id      ON event(match_id);
CREATE INDEX idx_event_category      ON event(category);

-- Orders
CREATE INDEX idx_order_fan_id        ON "order"(fan_id);
CREATE INDEX idx_order_status        ON "order"(status);

-- Partner
CREATE INDEX idx_partner_category    ON partner_service(category);
CREATE INDEX idx_partner_city        ON partner_service(city);
CREATE INDEX idx_partner_booking_fan ON partner_booking(fan_id);

-- Safety
CREATE INDEX idx_safety_place_city   ON safety_place(city);
CREATE INDEX idx_alert_match         ON official_alert(match_id);
CREATE INDEX idx_support_request_fan ON support_request(fan_id);

-- ============================================================
-- SEED DATA — Mock pour hackathon
-- ============================================================

INSERT INTO stadium (id, name, city, address, latitude, longitude, capacity) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Ibn Batouta Stadium',   'Tangier',     'Route de Rabat, Tangier',       35.7595, -5.8340, 45000),
  ('a1000000-0000-0000-0000-000000000002', 'Grand Stade de Casablanca', 'Casablanca', 'Bouskoura, Casablanca',       33.3731, -7.5898, 93000),
  ('a1000000-0000-0000-0000-000000000003', 'Stade de Marrakech',    'Marrakech',   'Route de Safi, Marrakech',      31.6295, -8.0086, 45240);

INSERT INTO gate (stadium_id, gate_code, zone, access_type, crowd_status, estimated_wait_min) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'A', 'Nord',  'general',  'high',   18),
  ('a1000000-0000-0000-0000-000000000001', 'B', 'Sud',   'general',  'medium', 8),
  ('a1000000-0000-0000-0000-000000000001', 'C', 'Est',   'general',  'low',    2),
  ('a1000000-0000-0000-0000-000000000001', 'D', 'Ouest', 'vip',      'low',    0),
  ('a1000000-0000-0000-0000-000000000001', 'E', 'Nord',  'pmr',      'low',    0);

INSERT INTO match (id, stadium_id, team_home, team_away, match_date, kickoff_time, championship, season, status) VALUES
  ('b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001',
   'Morocco', 'Brazil', '2030-06-14', '21:00', 'FIFA World Cup 2030', '2030', 'scheduled'),
  ('b1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000002',
   'Spain', 'Argentina', '2030-06-18', '18:00', 'FIFA World Cup 2030', '2030', 'scheduled');

INSERT INTO event (stadium_id, match_id, name, category, location_label, start_time, end_time, density, is_official) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Fan Zone A — Live Music', 'official', 'Esplanade Nord', '17:00', '23:00', 'Dense', TRUE),
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Watch Party Atlas', 'watch', 'Place Al Barid', '15:30', '17:00', 'Calme', FALSE),
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Skills Challenge Sponsor', 'sponsor', 'Village Sponsors Nord', '12:00', '18:30', 'Controle', FALSE),
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Lancement Maillot Maroc', 'club', 'FanPass Arena Pop-up', '19:00', '22:00', 'Controle', TRUE),
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Family Ocean Stage', 'family', 'Bouregreg Fan Park', '14:00', '23:30', 'Calme', FALSE),
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Official FanPass Store', 'official', 'Près Gate D', '14:00', '23:00', 'Controle', TRUE);

INSERT INTO product (name, category, team, price_mad, stock, pickup, is_available) VALUES
  ('Morocco Home Jersey 2030',       'official',  'Maroc',     790, 200, ARRAY['stadium', 'fan_zone', 'event'], TRUE),
  ('Spain Away Scarf',               'souvenir',  'Espagne',   220, 500, ARRAY['stadium', 'fan_zone'],           TRUE),
  ('World Cup 2030 Limited Pin',     'sponsor',   'FanPass',   360, 1000, ARRAY['fan_zone'],                     TRUE),
  ('Wydad Heritage 2031',            'post2030',  'Wydad AC',  640, 150, ARRAY['event', 'stadium'],              TRUE),
  ('Babouche Supporter Edition',     'local',     'Artisans',  310, 45,  ARRAY['event', 'fan_zone'],             TRUE),
  ('Raja Streetwear Drop',           'club',      'Raja CA',   590, 60,  ARRAY['event', 'fan_zone'],             TRUE);

INSERT INTO emergency_contact (title, value, detail, tone, sort_order) VALUES
  ('Urgence supporter',   'SOS FanPass', 'Alerte staff stade + position gate',          'critical', 0),
  ('Police',              '19',          'Incident, vol, foule dangereuse',              'info',     1),
  ('Ambulance',           '15',          'Malaise, blessure, urgence médicale',          'critical', 2),
  ('Assistance tourisme', 'ONMT Desk',   'Langues, perte documents, orientation',        'success',  3);

INSERT INTO safety_place (type, name, city, distance, eta, open_hours, detail) VALUES
  ('hospital',  'Poste médical Anfa',     'Casablanca', '850 m',  '7 min',  '24/7',           'Premiers soins et orientation ambulance stade.'),
  ('pharmacy',  'Pharmacie Corniche',     'Casablanca', '1.2 km', '10 min', 'Jusqu''à 01:00', 'Médicaments courants, hydratation.'),
  ('police',    'Point police Nord',      'Casablanca', '300 m',  '3 min',  'Match-day',      'Perte, vol, incident.'),
  ('tourism',   'Assistance touristique', 'Casablanca', 'Gate C', '2 min',  '12:00 - 01:00',  'Support EN/FR/ES.');

INSERT INTO partner_service (category, name, partner, city, journey_step, price_label, rating, eta_label, distance_label, match_tag, gate_tag, benefit) VALUES
  ('mobility',    'VTC Gate C Drop-off',  'Taxi Vert Partner', 'Casablanca', 'to_gate',    'À partir de 95 MAD', 4.8, '8 min',     'Drop-off Nord',      'Morocco vs Brazil', 'Gate C', 'Point de dépôt validé.'),
  ('stay',        'Hotel Fan Shuttle',    'Atlas Hospitality',  'Casablanca', 'pre_match',  'Pack 1 nuit',         4.6, 'Navette 17:40', '4.2 km stade',      'Morocco vs Brazil', NULL,     'Navette incluse vers Gate C.'),
  ('food',        'Table supporter',      'Casa Food Court',    'Casablanca', 'fan_zone',   'Menu 160 MAD',        4.7, 'Créneau 16:30', 'Fan zone',          NULL,                NULL,     'Menu rapide avant navette.'),
  ('tourism',     'Mini tour Casablanca', 'Visit Morocco',      'Casablanca', 'pre_match',  '290 MAD',             4.5, 'Départ 11:00', 'Retour fan zone',   'Morocco vs Brazil', NULL,     'Tour court jour du match.'),
  ('experience',  'Atlas Fan Pack',       'Fan Embassy',        'Casablanca', 'to_gate',    '420 MAD',             4.9, 'Départ 17:25', 'Casa Port',         'Morocco vs Brazil', 'Gate C', 'Guide groupe + chants.');
