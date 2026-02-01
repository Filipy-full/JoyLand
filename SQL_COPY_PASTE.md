# 🔧 SQL para Supabase - Copy & Paste

**Instrucciones:**
1. Ve a tu proyecto en https://supabase.com/dashboard
2. Click en SQL Editor → New Query
3. Copia todo el código de abajo
4. Pega en Supabase SQL Editor
5. Click en "Run" (botón azul)

---

## 📝 SQL Completo

```sql
-- ========================================
-- ACTUALIZAR TABLA ADOPTIONS (YA EXISTE)
-- ========================================

-- Agregar columnas nuevas
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'adopted' CHECK (status IN ('available', 'adopted', 'reserved'));
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed'));
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS certificate_url TEXT;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS certificate_code TEXT UNIQUE;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS tree_name TEXT;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS gift_message TEXT;

-- Llenar start_date y end_date para adopciones existentes
UPDATE adoptions SET 
  start_date = created_at,
  end_date = created_at + INTERVAL '1 year'
WHERE start_date IS NULL;

-- ========================================
-- CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE adoptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own adoptions" ON adoptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their adoptions" ON adoptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- CREAR ÍNDICES (PERFORMANCE)
-- ========================================

CREATE INDEX IF NOT EXISTS idx_adoptions_user_id ON adoptions(user_id);
CREATE INDEX IF NOT EXISTS idx_adoptions_payment_status ON adoptions(payment_status);
CREATE INDEX IF NOT EXISTS idx_adoptions_certificate_code ON adoptions(certificate_code);
```

---

## ✅ Verificación Posterior

Una vez ejecutado el SQL, verifica que todo está correcto:

```sql
-- Ver estructura de la tabla
\d adoptions

-- Ver que los campos existen
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'adoptions';

-- Ver políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'adoptions';

-- Ver índices
SELECT indexname FROM pg_indexes WHERE tablename = 'adoptions';
```

---

## 🎯 Resultado Esperado

Deberías ver en Table Editor → adoptions:

```
Columnas:
✅ id (uuid)
✅ user_id (uuid)
✅ user_name (text)
✅ user_email (text)
✅ tree_id (text)
✅ created_at (timestamp)
✅ status (text)
✅ payment_status (text)
✅ start_date (timestamp)
✅ end_date (timestamp)
✅ stripe_session_id (text)
✅ certificate_code (text)
✅ certificate_url (text)
✅ tree_name (text)
✅ gift_message (text)

RLS:
✅ "Users can view own adoptions"
✅ "Users can insert their adoptions"

Índices:
✅ idx_adoptions_user_id
✅ idx_adoptions_payment_status
✅ idx_adoptions_certificate_code
```

---

## 🧪 Test After Setup

```sql
-- Ver todas las adopciones
SELECT * FROM adoptions ORDER BY created_at DESC;

-- Ver solo tus adopciones (como usuario autenticado)
SELECT * FROM adoptions 
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- Contar adopciones por estado
SELECT status, COUNT(*) as count FROM adoptions GROUP BY status;

-- Ver certificados generados
SELECT id, certificate_code, certificate_url 
FROM adoptions 
WHERE certificate_code IS NOT NULL;
```

---

## ⚠️ Si algo sale mal

### Error: "relation adoptions does not exist"
```
Significa que no tienes la tabla.
Crea la tabla base primero:

CREATE TABLE adoptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  user_name text,
  user_email text,
  tree_id text,
  created_at timestamp with time zone default now()
);
```

### Error: "column already exists"
```
Significa que el campo ya existe.
Ignore el error (el IF NOT EXISTS evita esto).
```

### Error: "policy named already exists"
```
Significa que ya existe la política RLS.
Ignore el error.
```

---

## 🚀 Una vez completado

Tu tabla estará lista para:
1. ✅ Recibir adopciones desde Stripe webhook
2. ✅ Generar certificados automáticos
3. ✅ Trackear pagos
4. ✅ Manejar renovaciones
5. ✅ Proteger datos privados (RLS)

---

## 📌 Atajos para después

**Ver dashboard:**
```
http://localhost:3000/dashboard
```

**Ver adopciones en Supabase:**
```
Dashboard → Table Editor → adoptions
```

**Ver logs de webhook:**
```
Terminal con: npm run dev
```

---

**Versión:** 0.1.0  
**Fecha:** 2026-02-01  
**Status:** ✅ Listo para usar
