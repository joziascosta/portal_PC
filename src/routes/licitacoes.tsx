import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Gavel } from "lucide-react";

const opts = queryOptions({
  queryKey: ["licitacoes"],
  queryFn: async () => (await supabase.from("licitacoes").select("*").order("created_at", { ascending: false })).data ?? [],
});

export const Route = createFileRoute("/licitacoes")({
  head: () => ({ meta: [{ title: "Licitações — Câmara Municipal" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: LicitacoesPage,
  errorComponent: ({ error }) => <div className="p-12 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-12 text-center">Não encontrado.</div>,
});

function LicitacoesPage() {
  const { data } = useSuspenseQuery(opts);
  return (
    <SiteLayout>
      <PageHero title="Licitações" subtitle="Editais, contratos e processos licitatórios." />
      <section className="container-portal py-12">
        {data.length === 0 ? (
          <div className="text-center py-16"><Gavel className="h-12 w-12 mx-auto text-gold mb-3" /><p className="text-muted-foreground">Nenhuma licitação publicada.</p></div>
        ) : (
          <div className="space-y-3">
            {data.map((l: any) => (
              <article key={l.id} className="bg-card border border-border rounded-xl p-5 flex flex-wrap items-start gap-4 justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">{l.modalidade}</span>
                    <span className="px-2 py-0.5 bg-muted text-xs rounded">{l.status}</span>
                    <span className="font-mono text-sm text-muted-foreground">Nº {l.numero}</span>
                  </div>
                  <p className="text-foreground">{l.objeto}</p>
                  {l.data_abertura && <p className="text-xs text-muted-foreground mt-1">Abertura: {new Date(l.data_abertura).toLocaleDateString("pt-BR")}</p>}
                </div>
                {l.arquivo_url && <a href={l.arquivo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep"><FileText className="h-4 w-4" /> Edital</a>}
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
