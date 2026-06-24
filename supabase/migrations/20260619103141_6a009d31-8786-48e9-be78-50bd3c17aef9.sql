
-- Helper: editor OR admin can write content
CREATE OR REPLACE FUNCTION public.can_edit_content(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role IN ('admin','editor'))
$$;

-- Content tables: allow admin OR editor to manage
DROP POLICY IF EXISTS "Admins gerenciam notícias" ON public.noticias;
CREATE POLICY "Editores gerenciam notícias" ON public.noticias FOR ALL TO authenticated
  USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));

DROP POLICY IF EXISTS "Admins gerenciam vereadores" ON public.vereadores;
CREATE POLICY "Editores gerenciam vereadores" ON public.vereadores FOR ALL TO authenticated
  USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));

DROP POLICY IF EXISTS "Admins gerenciam leis" ON public.leis;
CREATE POLICY "Editores gerenciam leis" ON public.leis FOR ALL TO authenticated
  USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));

DROP POLICY IF EXISTS "Admins gerenciam documentos" ON public.documentos_transparencia;
CREATE POLICY "Editores gerenciam documentos" ON public.documentos_transparencia FOR ALL TO authenticated
  USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));

DROP POLICY IF EXISTS "lic_admin_write" ON public.licitacoes;
CREATE POLICY "lic_edit_write" ON public.licitacoes FOR ALL TO authenticated
  USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));

DROP POLICY IF EXISTS "pl_admin_write" ON public.projetos_lei;
CREATE POLICY "pl_edit_write" ON public.projetos_lei FOR ALL TO authenticated
  USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));

DROP POLICY IF EXISTS "po_admin_write" ON public.publicacoes_oficiais;
CREATE POLICY "po_edit_write" ON public.publicacoes_oficiais FOR ALL TO authenticated
  USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));

DROP POLICY IF EXISTS "pi_admin_write" ON public.paginas_institucionais;
CREATE POLICY "pi_edit_write" ON public.paginas_institucionais FOR ALL TO authenticated
  USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));

DROP POLICY IF EXISTS "bh_admin_write" ON public.banners_home;
CREATE POLICY "bh_edit_write" ON public.banners_home FOR ALL TO authenticated
  USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));

-- site_config remains admin-only (sc_admin_write already restricted to admin)

-- Admins manage user_roles
CREATE POLICY "Admins gerenciam papéis" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Admins veem todos os profiles
CREATE POLICY "Admins veem todos os profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
