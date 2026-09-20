-- ==============================================================================
-- PERSONAL FILE HUB + CHAT + OFFICE PREVIEW - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. WHITELIST TABLE (allowed_users)
-- Only users listed in this table are permitted access to the hub.
CREATE TABLE IF NOT EXISTS public.allowed_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read whitelist"
  ON public.allowed_users FOR SELECT
  TO authenticated
  USING (true);

-- 2. ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'hash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow whitelisted users to read rooms"
  ON public.rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.allowed_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
  );

CREATE POLICY "Allow whitelisted users to create rooms"
  ON public.rooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.allowed_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
  );

-- 3. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  content TEXT,
  file_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow whitelisted users to read messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.allowed_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
  );

CREATE POLICY "Allow whitelisted users to insert messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.allowed_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
    AND auth.uid() = user_id
  );

-- 4. FILES TABLE
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  uploader_email TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow whitelisted users to read files"
  ON public.files FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.allowed_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
  );

CREATE POLICY "Allow whitelisted users to insert files"
  ON public.files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.allowed_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
    AND auth.uid() = uploaded_by
  );

CREATE POLICY "Allow file uploader to delete files"
  ON public.files FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.allowed_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
    AND auth.uid() = uploaded_by
  );

-- 5. INDEXES FOR HIGH-PERFORMANCE QUERIES
CREATE INDEX IF NOT EXISTS idx_messages_room_created ON public.messages(room_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_files_room_created ON public.files(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_allowed_users_email ON public.allowed_users(LOWER(email));

-- 6. ENABLE REALTIME PUBLICATION
-- Enables browser websocket subscriptions to incoming chat messages and file drops
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'files'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.files;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
  END IF;
END $$;

-- 7. INITIAL SEED ROOMS
INSERT INTO public.rooms (name, slug, description, icon) VALUES
  ('General', 'general', 'Main hub for general discussion and file drops', 'message-square'),
  ('Urian', 'urian', 'School, courses, and project files', 'graduation-cap'),
  ('xalhexi Films', 'xalhexi-films', 'Video production, scripts, and media assets', 'film'),
  ('Personal', 'personal', 'Private personal docs, notes, and records', 'lock')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon;

-- 8. INITIAL WHITELIST SEED
-- Add your initial admin/user email here (replace with your email):
-- INSERT INTO public.allowed_users (email, display_name) 
-- VALUES ('your-email@example.com', 'Admin') 
-- ON CONFLICT (email) DO NOTHING;

-- ==============================================================================
-- STORAGE BUCKET INSTRUCTIONS
-- In Supabase Dashboard -> Storage:
-- 1. Create a new bucket named: hub-files
-- 2. Make it Private (Public: OFF)
-- 3. In Storage Policies, add:
--    - "Allow authenticated users to upload to hub-files" (INSERT)
--    - "Allow authenticated users to read from hub-files" (SELECT)
--    - "Allow authenticated users to delete their files" (DELETE)
-- ==============================================================================
