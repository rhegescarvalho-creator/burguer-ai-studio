-- ==========================================
-- BURGER AI STUDIO - SUPABASE SCHEMA & TABLES
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- 1. Tabela de Usuários (users)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Restaurantes (restaurants)
CREATE TABLE IF NOT EXISTS public.restaurants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#E63946',
  secondary_color TEXT DEFAULT '#1D3557',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Categorias (categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL DEFAULT '🍔',
  "desc" TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Produtos (products)
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
  created_at TIMESTAMPTZ DEFAULT now(),
  restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE SET NULL
);

-- 5. Tabela de Configurações das TVs (playlists, Grade e Turnos)
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

-- 6. Tabela de Promoções (promotions)
CREATE TABLE IF NOT EXISTS public.promotions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Tabela de Campanhas (campaigns)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  restaurant_id TEXT NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  theme TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Tabela de Assets das Campanhas (assets)
CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  campaign_id TEXT NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- COPYWRITING, IMAGE, VIDEO, TV_BOARD, SOCIAL_POST
  url TEXT,
  content TEXT,
  metadata TEXT DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Tabela de Tarefas dos Agentes (agent_tasks)
CREATE TABLE IF NOT EXISTS public.agent_tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  campaign_id TEXT NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  agent TEXT NOT NULL, -- orchestrator, copywriter, designer, image, video, tv, social, publisher
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED
  input TEXT DEFAULT '{}',
  output TEXT DEFAULT '{}',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Tabela de Mídias dos Produtos (media)
CREATE TABLE IF NOT EXISTS public.media (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  produto_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- imagem, video, post, story, tv
  caminho TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Tabela de Associação Muitos-para-Muitos (produtos e promoções)
CREATE TABLE IF NOT EXISTS public."_ProductToPromotion" (
  "A" TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  "B" TEXT NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "_ProductToPromotion_AB_unique" ON public."_ProductToPromotion"("A", "B");
CREATE INDEX IF NOT EXISTS "_ProductToPromotion_B_index" ON public."_ProductToPromotion"("B");

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tv_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_ProductToPromotion" ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso livre (Anon Key) para desenvolvimento local
DROP POLICY IF EXISTS "Allow public read/write on users" ON public.users;
CREATE POLICY "Allow public read/write on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on restaurants" ON public.restaurants;
CREATE POLICY "Allow public read/write on restaurants" ON public.restaurants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on categories" ON public.categories;
CREATE POLICY "Allow public read/write on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on products" ON public.products;
CREATE POLICY "Allow public read/write on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on tv_settings" ON public.tv_settings;
CREATE POLICY "Allow public read/write on tv_settings" ON public.tv_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on promotions" ON public.promotions;
CREATE POLICY "Allow public read/write on promotions" ON public.promotions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on campaigns" ON public.campaigns;
CREATE POLICY "Allow public read/write on campaigns" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on assets" ON public.assets;
CREATE POLICY "Allow public read/write on assets" ON public.assets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on agent_tasks" ON public.agent_tasks;
CREATE POLICY "Allow public read/write on agent_tasks" ON public.agent_tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on media" ON public.media;
CREATE POLICY "Allow public read/write on media" ON public.media FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on _ProductToPromotion" ON public."_ProductToPromotion";
CREATE POLICY "Allow public read/write on _ProductToPromotion" ON public."_ProductToPromotion" FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- SUPABASE REALTIME SYNC
-- ==========================================

-- Ativar Supabase Realtime para sincronização instantânea das TVs
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tv_settings;
