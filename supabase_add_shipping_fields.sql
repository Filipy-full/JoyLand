-- Agregar campos de dirección de envío a la tabla adoptions
-- Ejecutar en Supabase SQL Editor

ALTER TABLE adoptions 
ADD COLUMN IF NOT EXISTS shipping_name TEXT,
ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Comentarios para documentar los campos
COMMENT ON COLUMN adoptions.shipping_name IS 'Nombre del destinatario para el envío del gift box';
COMMENT ON COLUMN adoptions.shipping_address IS 'Dirección de envío completa en formato JSON (line1, line2, city, state, postal_code, country)';
