import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Newspaper, Users, ScrollText, FileText, LogOut, ArrowLeft, BookOpen, Gavel, FileSignature, Megaphone, Image as ImageIcon, Settings, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useMyRoles } from "@/hooks/use-role";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/paginas", label: "Páginas", icon: BookOpen },
  { to: "/admin/noticias", label: "Notícias", icon: Newspaper },
  { to: "/admin/vereadores", label: "Vereadores", icon: Users },
  { to: "/admin/leis", label: "Legislação", icon: ScrollText },
  { to: "/admin/projetos", label: "Projetos de Lei", icon: FileSignature },
  { to: "/admin/licitacoes", label: "Licitações", icon: Gavel },
  { to: "/admin/publicacoes", label: "Publicações", icon: Megaphone },
  { to: "/admin/documentos", label: "Documentos", icon: FileText },
  { to: "/admin/banners", label: "Banners Home", icon: ImageIcon },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings, adminOnly: true },
  { to: "/admin/usuarios", label: "Usuários", icon: ShieldCheck, adminOnly: true },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: roles = [] } = useMyRoles();
  const isAdmin = roles.includes("admin");

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-topbar text-topbar-foreground flex flex-col">
        <div className="p-5 border-b border-white/10">
          <p className="text-xs uppercase tracking-widest text-gold/80">Painel</p>
          <h1 className="font-display text-lg font-bold leading-tight mt-1">Câmara · Admin</h1>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.filter((i) => !("adminOnly" in i && i.adminOnly) || isAdmin).map((item) => {
            const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition ${active ? "bg-gold text-gold-foreground font-semibold" : "hover:bg-white/10"}`}>
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Ver portal
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-destructive/30">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
