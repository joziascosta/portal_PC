import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Megaphone } from "lucide-react";

const opts = queryOptions({
  queryKey: ["publicacoes"],
  queryFn: async () => (await supabase.from("publicacoes_oficiais").select("*").order("data_publicacao", { ascending: false })).data ?? [],
});

export const Route = createFileRoute("/publicacoes")({
  head: () => ({ meta: [{ title: "Publicações — Câmara Municipal" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: PublicacoesPage,
  errorComponent: ({ error }) => <div className="p-12 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-12 text-center">Não encontrado.</div>,
});

function PublicacoesPage() {
  const { data } = useSuspenseQuery(opts);
  return (
    <SiteLayout>
      <PageHero title="Publicações Oficiais" subtitle="Atas, pautas, diários oficiais e outras publicações." />
      <section className="container-portal py-12">
        {data.length === 0 ? (
          <div className="text-center py-16"><Megaphone className="h-12 w-12 mx-auto text-gold mb-3" /><p className="text-muted-foreground">Nenhuma publicação ainda.</p></div>
        ) : (
          <div className="space-y-3">
            {data.map((p: any) => (
              <article key={p.id} className="bg-card border border-border rounded-xl p-5 flex flex-wrap items-start gap-4 justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">{p.tipo}</span>
                    <span className="text-xs text-muted-foreground">{new Date(p.data_publicacao).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <p className="font-medium">{p.titulo}</p>
                  {p.descricao && <p className="text-sm text-muted-foreground mt-1">{p.descricao}</p>}
                </div>
                {p.arquivo_url && <a href={p.arquivo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep"><FileText className="h-4 w-4" /> Abrir</a>}
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
