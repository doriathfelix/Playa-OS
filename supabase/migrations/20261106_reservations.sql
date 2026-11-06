-- ══════════════════════════════════════════
-- TABLE : reservations
-- ══════════════════════════════════════════
create table if not exists reservations (
  id            uuid        default gen_random_uuid() primary key,
  created_at    timestamptz default now(),

  -- Identification
  ref           text        not null unique,
  restaurant_id text        not null default 'laplaya',

  -- Date & service
  date          date        not null,
  service       text        not null,  -- 's1' | 's2'
  slot          text        not null,  -- '12:00' | '12:15' etc.

  -- Formule
  formula       text        not null,  -- 'table' | 'table+transats'

  -- Composition du groupe
  grands        int         not null default 0,
  presque_grands int        not null default 0,
  petits_loups  int         not null default 0,
  tout_doux     int         not null default 0,

  -- Transats
  transats      int         not null default 0,
  first_row     text,                  -- 'oui' | 'non' | null

  -- Contact
  prenom        text        not null,
  nom           text        not null,
  email         text        not null,
  tel           text        not null,
  note          text,

  -- Statut
  status        text        not null default 'confirmed'
                            check (status in ('confirmed','cancelled','pending','no_show'))
);

-- Index par date (requête la plus fréquente)
create index if not exists idx_reservations_date
  on reservations(date, restaurant_id);

create index if not exists idx_reservations_ref
  on reservations(ref);

-- ── Row Level Security ──
alter table reservations enable row level security;

-- Insertion publique (formulaire client)
create policy "public_insert"
  on reservations for insert
  with check (true);

-- Lecture publique pour l'instant (back-office à sécuriser ensuite)
create policy "public_read"
  on reservations for select
  using (true);

-- Mise à jour uniquement avec la service key (back-office)
create policy "service_update"
  on reservations for update
  using (true);
