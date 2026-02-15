-- Supabase RLS Policies para tablas principales
-- Puedes ejecutar este archivo en el SQL Editor de Supabase

-- USERS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios autenticados ver su propio perfil
CREATE POLICY "Users: Select own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Permitir a usuarios autenticados insertar su propio perfil
CREATE POLICY "Users: Insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Permitir a usuarios autenticados actualizar su propio perfil
CREATE POLICY "Users: Update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- TREES
ALTER TABLE public.trees ENABLE ROW LEVEL SECURITY;

-- Permitir a todos leer árboles (puedes ajustar esto si quieres restringir)
CREATE POLICY "Trees: Public read" ON public.trees
  FOR SELECT USING (true);

-- Permitir solo a usuarios autenticados insertar árboles (opcional)
CREATE POLICY "Trees: Insert by authenticated" ON public.trees
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir solo a usuarios autenticados actualizar árboles (opcional)
CREATE POLICY "Trees: Update by authenticated" ON public.trees
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ADOPTIONS
ALTER TABLE public.adoptions ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios ver solo sus propias adopciones
CREATE POLICY "Adoptions: Select own" ON public.adoptions
  FOR SELECT USING (auth.uid() = user_id);

-- Permitir a usuarios insertar adopciones propias
CREATE POLICY "Adoptions: Insert own" ON public.adoptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir a usuarios actualizar solo sus propias adopciones
CREATE POLICY "Adoptions: Update own" ON public.adoptions
  FOR UPDATE USING (auth.uid() = user_id);

-- CONTACT_MESSAGES
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios insertar mensajes de contacto
CREATE POLICY "ContactMessages: Insert by authenticated" ON public.contact_messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir a administradores ver todos los mensajes (ajusta el rol si tienes uno)
CREATE POLICY "ContactMessages: Admin read" ON public.contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- MESSAGE_REPLIES
ALTER TABLE public.message_replies ENABLE ROW LEVEL SECURITY;

-- Permitir a administradores insertar respuestas (ajusta el rol si tienes uno)
CREATE POLICY "MessageReplies: Insert by authenticated" ON public.message_replies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir a administradores ver todas las respuestas
CREATE POLICY "MessageReplies: Admin read" ON public.message_replies
  FOR SELECT USING (auth.role() = 'authenticated');
