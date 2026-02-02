-- Agregar campo hidden_from_admin a la tabla reports
ALTER TABLE reports ADD COLUMN IF NOT EXISTS hidden_from_admin BOOLEAN DEFAULT false;
