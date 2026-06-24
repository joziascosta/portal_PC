import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Calendar, ArrowRight } from "lucide-react";

const noticiasListOptions = queryOptions({
  queryKey: ["noticias", "list"],
  queryFn: async () => {
    const { data } = await supabase
      .from("noticias")
      .select("id, titulo, slug, resumo, imagem_url, data_publicacao")
      .eq("publicada", true)
      .order("data_publicacao", { ascending: false });
    return data ?? [];
  },
});

export const Route = createFileRoute("/noticias/")({
  head: () => ({
    meta: [
      { title: "Notícias — Câmara Municipal de Couto de Magalhães de Minas" },
      { name: "description", content: "Acompanhe as últimas notícias e comunicados da Câmara." },
    ],
  }),
  loader: ({ context }) => context.queryClient.prefetchQuery(noticiasListOptions),
  component: NoticiasPage,
});

function NoticiasPage() {
  const { data: noticias } = useSuspenseQuery(noticiasListOptions);

  return (
    <SiteLayout>
      <PageHero title="Notícias" subtitle="Comunicados, eventos e acontecimentos da Câmara Municipal." />
      <section className="container-portal py-12 md:py-16">
        {noticias.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma notícia publicada ainda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((n) => (
              <article key={n.id} className="bg-card rounded-xl overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition group">
                <div className="aspect-[16/10] bg-muted overflow-hidden">
                  {n.imagem_url ? (
                    <img src={n.imagem_url} alt={n.titulo} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Building2 className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(n.data_publicacao).toLocaleDateString("pt-BR")}
                  </p>
                  <h3 className="font-display text-lg font-bold text-primary-deep line-clamp-2">{n.titulo}</h3>
                  {n.resumo && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{n.resumo}</p>}
                  <Link to="/noticias/$slug" params={{ slug: n.slug }} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-gold-foreground">
                    Ler mais <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
