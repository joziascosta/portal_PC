
-- Páginas institucionais (conteúdo editável por slug)
CREATE TABLE public.paginas_institucionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL DEFAULT '',
  ordem INT NOT NULL DEFAULT 0,
  publicado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.paginas_institucionais TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.paginas_institucionais TO authenticated;
GRANT ALL ON public.paginas_institucionais TO service_role;
ALTER TABLE public.paginas_institucionais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pi_read_all" ON public.paginas_institucionais FOR SELECT USING (true);
CREATE POLICY "pi_admin_write" ON public.paginas_institucionais FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER pi_touch BEFORE UPDATE ON public.paginas_institucionais FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Licitações
CREATE TABLE public.licitacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  modalidade TEXT NOT NULL,
  objeto TEXT NOT NULL,
  data_abertura DATE,
  status TEXT NOT NULL DEFAULT 'aberta',
  arquivo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.licitacoes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.licitacoes TO authenticated;
GRANT ALL ON public.licitacoes TO service_role;
ALTER TABLE public.licitacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lic_read_all" ON public.licitacoes FOR SELECT USING (true);
CREATE POLICY "lic_admin_write" ON public.licitacoes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER lic_touch BEFORE UPDATE ON public.licitacoes FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Projetos de lei
CREATE TABLE public.projetos_lei (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  ano INT NOT NULL,
  autor TEXT,
  ementa TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'em_tramitacao',
  arquivo_url TEXT,
  data_apresentacao DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projetos_lei TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projetos_lei TO authenticated;
GRANT ALL ON public.projetos_lei TO service_role;
ALTER TABLE public.projetos_lei ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pl_read_all" ON public.projetos_lei FOR SELECT USING (true);
CREATE POLICY "pl_admin_write" ON public.projetos_lei FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER pl_touch BEFORE UPDATE ON public.projetos_lei FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Publicações oficiais
CREATE TABLE public.publicacoes_oficiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  data_publicacao DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao TEXT,
  arquivo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publicacoes_oficiais TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.publicacoes_oficiais TO authenticated;
GRANT ALL ON public.publicacoes_oficiais TO service_role;
ALTER TABLE public.publicacoes_oficiais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "po_read_all" ON public.publicacoes_oficiais FOR SELECT USING (true);
CREATE POLICY "po_admin_write" ON public.publicacoes_oficiais FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER po_touch BEFORE UPDATE ON public.publicacoes_oficiais FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Banners da home
CREATE TABLE public.banners_home (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  imagem_url TEXT NOT NULL,
  link_url TEXT,
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners_home TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners_home TO authenticated;
GRANT ALL ON public.banners_home TO service_role;
ALTER TABLE public.banners_home ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bh_read_all" ON public.banners_home FOR SELECT USING (true);
CREATE POLICY "bh_admin_write" ON public.banners_home FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER bh_touch BEFORE UPDATE ON public.banners_home FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Configurações do site (chave/valor JSON, singleton por chave)
CREATE TABLE public.site_config (
  chave TEXT PRIMARY KEY,
  valor JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_config TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_config TO authenticated;
GRANT ALL ON public.site_config TO service_role;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sc_read_all" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "sc_admin_write" ON public.site_config FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER sc_touch BEFORE UPDATE ON public.site_config FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed inicial
INSERT INTO public.site_config (chave, valor) VALUES
('contato', '{"endereco":"","telefone":"","email":"","horario":""}'::jsonb),
('rodape', '{"sobre":"","links":[]}'::jsonb)
ON CONFLICT (chave) DO NOTHING;

INSERT INTO public.paginas_institucionais (slug, titulo, conteudo, ordem) VALUES
('historia','História','', 1),
('estrutura','Estrutura Organizacional','', 2),
('regimento','Regimento Interno','', 3),
('lei-organica','Lei Orgânica','', 4)
ON CONFLICT (slug) DO NOTHING;
