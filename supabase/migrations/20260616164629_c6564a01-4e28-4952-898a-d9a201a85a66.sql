
-- Enum para papéis
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles selecionáveis pelo próprio usuário" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles editáveis pelo próprio usuário" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles inseríveis pelo próprio usuário" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários veem seus próprios papéis" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Trigger updated_at genérico
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Auto criar profile no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Notícias
CREATE TABLE public.noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  resumo TEXT,
  conteudo TEXT NOT NULL,
  imagem_url TEXT,
  publicada BOOLEAN NOT NULL DEFAULT false,
  data_publicacao TIMESTAMPTZ NOT NULL DEFAULT now(),
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.noticias TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.noticias TO authenticated;
GRANT ALL ON public.noticias TO service_role;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notícias publicadas são públicas" ON public.noticias FOR SELECT TO anon USING (publicada = true);
CREATE POLICY "Autenticados leem todas as notícias" ON public.noticias FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins gerenciam notícias" ON public.noticias FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER noticias_updated_at BEFORE UPDATE ON public.noticias FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX noticias_publicada_data_idx ON public.noticias (publicada, data_publicacao DESC);

-- Vereadores
CREATE TABLE public.vereadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT 'Vereador(a)',
  partido TEXT,
  foto_url TEXT,
  biografia TEXT,
  email TEXT,
  telefone TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vereadores TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vereadores TO authenticated;
GRANT ALL ON public.vereadores TO service_role;
ALTER TABLE public.vereadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vereadores ativos são públicos" ON public.vereadores FOR SELECT TO anon USING (ativo = true);
CREATE POLICY "Autenticados leem todos os vereadores" ON public.vereadores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins gerenciam vereadores" ON public.vereadores FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER vereadores_updated_at BEFORE UPDATE ON public.vereadores FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Leis
CREATE TABLE public.leis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  ano INTEGER NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'Lei Ordinária',
  ementa TEXT NOT NULL,
  arquivo_url TEXT,
  data_publicacao DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.leis TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leis TO authenticated;
GRANT ALL ON public.leis TO service_role;
ALTER TABLE public.leis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leis são públicas" ON public.leis FOR SELECT TO anon USING (true);
CREATE POLICY "Autenticados leem leis" ON public.leis FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins gerenciam leis" ON public.leis FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER leis_updated_at BEFORE UPDATE ON public.leis FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX leis_ano_idx ON public.leis (ano DESC, numero DESC);

-- Documentos de transparência
CREATE TABLE public.documentos_transparencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  ano INTEGER NOT NULL,
  descricao TEXT,
  arquivo_url TEXT,
  data_publicacao DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.documentos_transparencia TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documentos_transparencia TO authenticated;
GRANT ALL ON public.documentos_transparencia TO service_role;
ALTER TABLE public.documentos_transparencia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Documentos são públicos" ON public.documentos_transparencia FOR SELECT TO anon USING (true);
CREATE POLICY "Autenticados leem documentos" ON public.documentos_transparencia FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins gerenciam documentos" ON public.documentos_transparencia FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER documentos_updated_at BEFORE UPDATE ON public.documentos_transparencia FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
