-- ==========================================
-- BURGER AI STUDIO - SUPABASE SCHEMA & TABLES
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- 1. Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categoria TEXT NOT NULL,
  preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  descricao TEXT,
  ingredientes TEXT DEFAULT '[]',
  ativo BOOLEAN DEFAULT true,
  imagem TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL DEFAULT '🍔',
  "desc" TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Configurações das TVs (Playlists, Grade e Turnos)
CREATE TABLE IF NOT EXISTS public.tv_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  playlists JSONB NOT NULL DEFAULT '{}'::jsonb,
  active_tv_id TEXT NOT NULL DEFAULT 'tv-salao',
  active_music TEXT NOT NULL DEFAULT 'Rock',
  active_turno TEXT NOT NULL DEFAULT 'almoco',
  ad_interval_minutes INT NOT NULL DEFAULT 30,
  ad_partner_name TEXT NOT NULL DEFAULT 'Coca-Cola',
  ad_duration_seconds INT NOT NULL DEFAULT 10,
  active_client_config JSONB NOT NULL DEFAULT '{"name":"Smash & Co.","primaryColor":"#FF5A1F","secondaryColor":"#FFB703"}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Promoções
CREATE TABLE IF NOT EXISTS public.promotions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security (RLS) aberta para leitura pública
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tv_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso livre (Anon Key)
DROP POLICY IF EXISTS "Allow public read/write on products" ON public.products;
CREATE POLICY "Allow public read/write on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on categories" ON public.categories;
CREATE POLICY "Allow public read/write on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on tv_settings" ON public.tv_settings;
CREATE POLICY "Allow public read/write on tv_settings" ON public.tv_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on promotions" ON public.promotions;
CREATE POLICY "Allow public read/write on promotions" ON public.promotions FOR ALL USING (true) WITH CHECK (true);

-- Ativar Supabase Realtime para sincronização instantânea das TVs
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tv_settings;
