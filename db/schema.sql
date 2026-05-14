-- Knight Logics Referral CRM Schema
-- Run once in your Neon project console (SQL Editor tab)
-- https://console.neon.tech → your project → SQL Editor

CREATE TABLE IF NOT EXISTS kl_referral_events (
    id             BIGSERIAL PRIMARY KEY,
    event_type     VARCHAR(40)  NOT NULL,   -- pageview | form_submit | checkout_start
    referral_partner VARCHAR(80),           -- ?ref= value  (e.g. "signshop-safety-harbor")
    referral_offer   VARCHAR(80),           -- ?offer= value (e.g. "SUMMER25")
    utm_medium       VARCHAR(80),
    utm_campaign     VARCHAR(80),
    first_url        TEXT,                  -- full URL of first attributed landing
    page_path        VARCHAR(300),          -- pathname at time of event
    contact_email    VARCHAR(160),          -- from form/checkout when available
    contact_name     VARCHAR(120),
    package_name     VARCHAR(120),          -- for checkout_start events
    amount_cents     INTEGER,               -- price in cents for checkout_start
    session_id       VARCHAR(64),           -- client-generated random ID (for dedup)
    ip_hash          VARCHAR(64),           -- SHA-256 of IP (privacy-safe)
    user_agent_short VARCHAR(120),
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_klre_partner  ON kl_referral_events (referral_partner);
CREATE INDEX IF NOT EXISTS idx_klre_offer    ON kl_referral_events (referral_offer);
CREATE INDEX IF NOT EXISTS idx_klre_type     ON kl_referral_events (event_type);
CREATE INDEX IF NOT EXISTS idx_klre_created  ON kl_referral_events (created_at DESC);
