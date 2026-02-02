-- Remove unique constraint from stripe_session_id to allow multiple adoptions per payment
ALTER TABLE adoptions DROP CONSTRAINT IF EXISTS adoptions_stripe_session_id_key;

-- Add a regular index instead (for performance, not uniqueness)
CREATE INDEX IF NOT EXISTS idx_adoptions_stripe_session_id ON adoptions(stripe_session_id);
