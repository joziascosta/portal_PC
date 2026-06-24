import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Users, ScrollText, FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [n, v, l, d] = await Promise.all([
        supabase.from("noticias").select("*", { count: "exact", head: true }),
        supabase.from("vereadores").select("*", { count: "exact", head: true }),
        supabase.from("leis").select("*", { count: "exact", head: true }),
        supabase.from("documentos_transparencia").select("*", { count: "exact", head: true }),
      ]);
      return {
        noticias: n.count ?? 0,
        vereadores: v.count ?? 0,
        leis: l.count ?? 0,
        documentos: d.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Notícias", icon: Newspaper, n: counts?.noticias ?? 0 },
    { label: "Vereadores", icon: Users, n: counts?.vereadores ?? 0 },
    { label: "Leis", icon: ScrollText, n: counts?.leis ?? 0 },
    { label: "Documentos", icon: FileText, n: counts?.documentos ?? 0 },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-display text-3xl font-bold text-primary-deep">Dashboard</h1>
      <p className="text-muted-foreground mt-1">Visão geral do conteúdo publicado no portal.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <c.icon className="h-6 w-6 text-primary" />
              <span className="font-display text-3xl font-bold text-primary-deep">{c.n}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground uppercase tracking-wider">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-xl font-bold text-primary-deep">Bem-vindo(a) ao painel administrativo</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Para começar a publicar conteúdo, você precisa ter o papel <strong>admin</strong> atribuído.
          Caso este seja o primeiro acesso, conceda permissão pelo painel do Lovable Cloud
          inserindo um registro na tabela <code className="bg-muted px-1 rounded">user_roles</code>
          com o seu user_id e role = <code className="bg-muted px-1 rounded">admin</code>.
        </p>
      </div>
    </div>
  );
}
