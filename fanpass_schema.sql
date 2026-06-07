-- ============================================================
-- FANPASS — Database Schema
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
    language              VARCHAR(10) DEFAULT 'en',
    supported_team        VARCHAR(100),
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
-- TICKETING
-- ============================================================

CREATE TABLE ticket (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id         UUID NOT NULL REFERENCES fan(id) ON DELETE RESTRICT,
    match_id       UUID NOT NULL REFERENCES match(id) ON DELETE RESTRICT,
    gate_id        UUID NOT NULL REFERENCES gate(id) ON DELETE RESTRICT,
    seat_section   VARCHAR(50),
    seat_row       VARCHAR(10),
    seat_number    VARCHAR(10),
    qr_payload     TEXT NOT NULL,
    qr_signature   TEXT NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'valid'
                        CHECK (status IN ('valid', 'scanned', 'cancelled', 'expired', 'transferred')),
    issued_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at     TIMESTAMP NOT NULL,
    scanned_at     TIMESTAMP,
    UNIQUE (match_id, seat_section, seat_row, seat_number)
);

-- ============================================================
-- MOBILITY & ITINERARY
-- ============================================================

CREATE TABLE itinerary (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id                UUID NOT NULL REFERENCES fan(id) ON DELETE CASCADE,
    match_id              UUID NOT NULL REFERENCES match(id) ON DELETE CASCADE,
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

-- ============================================================
-- COMMUNITY & MATCHING
-- ============================================================

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
-- FAN EVENTS & ZONES
-- ============================================================

CREATE TABLE event (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stadium_id      UUID REFERENCES stadium(id),
    match_id        UUID REFERENCES match(id),
    name            VARCHAR(200) NOT NULL,
    category        VARCHAR(50) NOT NULL
                        CHECK (category IN ('fan_zone', 'concert', 'sponsor', 'watch_party',
                                            'merch', 'food', 'family', 'community')),
    location_label  VARCHAR(255),
    latitude        DECIMAL(9,6),
    longitude       DECIMAL(9,6),
    start_time      TIME,
    end_time        TIME,
    is_official     BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================
-- MERCHANDISING
-- ============================================================

CREATE TABLE product (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         VARCHAR(200) NOT NULL,
    category     VARCHAR(50) NOT NULL
                    CHECK (category IN ('jersey', 'scarf', 'accessory', 'collectible', 'souvenir', 'digital')),
    description  TEXT,
    price_mad    INTEGER NOT NULL CHECK (price_mad >= 0),
    stock        INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url    TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "order" (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id           UUID NOT NULL REFERENCES fan(id) ON DELETE RESTRICT,
    status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'confirmed', 'ready', 'collected', 'cancelled')),
    total_mad        INTEGER NOT NULL CHECK (total_mad >= 0),
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
-- INDEXES
-- ============================================================

-- Fan lookups
CREATE INDEX idx_fan_email           ON fan(email);
CREATE INDEX idx_fan_fan_id_token    ON fan(fan_id_token);
CREATE INDEX idx_fan_fan_id_status   ON fan(fan_id_status);

-- Ticket validation (hot path)
CREATE INDEX idx_ticket_fan_id       ON ticket(fan_id);
CREATE INDEX idx_ticket_match_id     ON ticket(match_id);
CREATE INDEX idx_ticket_status       ON ticket(status);
CREATE INDEX idx_ticket_qr_signature ON ticket(qr_signature);

-- Gate crowd monitoring
CREATE INDEX idx_gate_stadium_id     ON gate(stadium_id);
CREATE INDEX idx_gate_crowd_status   ON gate(crowd_status);

-- Match schedule
CREATE INDEX idx_match_date          ON match(match_date);
CREATE INDEX idx_match_stadium_id    ON match(stadium_id);
CREATE INDEX idx_match_status        ON match(status);

-- Itinerary
CREATE INDEX idx_itinerary_fan_match ON itinerary(fan_id, match_id);
CREATE INDEX idx_itinerary_step_ord  ON itinerary_step(itinerary_id, step_order);

-- Community
CREATE INDEX idx_community_match     ON fan_match_community(match_id);

-- Events
CREATE INDEX idx_event_match_id      ON event(match_id);
CREATE INDEX idx_event_category      ON event(category);

-- Orders
CREATE INDEX idx_order_fan_id        ON "order"(fan_id);
CREATE INDEX idx_order_status        ON "order"(status);

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
   'Morocco', 'Brazil',
   '2030-06-14', '21:00',
   'FIFA World Cup 2030', '2030', 'scheduled'),
  ('b1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000002',
   'Spain', 'Argentina',
   '2030-06-18', '18:00',
   'FIFA World Cup 2030', '2030', 'scheduled');

INSERT INTO event (stadium_id, match_id, name, category, location_label, start_time, end_time, is_official) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Fan Zone A — Live Music', 'fan_zone', 'Esplanade Nord', '17:00', '23:00', TRUE),
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Street Food Market', 'food', 'Fan Zone B', '15:00', '23:30', FALSE),
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'FIFA Trophy Experience', 'sponsor', 'Plaza Principale', '16:00', '20:00', TRUE),
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Official FanPass Store', 'merch', 'Près Gate D', '14:00', '23:00', TRUE);

INSERT INTO product (name, category, price_mad, stock, is_available) VALUES
  ('Morocco Home Jersey 2030',       'jersey',      450, 200, TRUE),
  ('Spain Away Scarf',               'scarf',       120, 500, TRUE),
  ('World Cup 2030 Limited Pin',     'collectible',  60, 1000, TRUE),
  ('Match Day Poster — Digital',     'digital',      30, 9999, TRUE),
  ('Morocco Away Jersey 2030',       'jersey',      420, 150, TRUE),
  ('Official Match Programme',       'souvenir',     80, 300, TRUE);

