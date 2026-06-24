import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, FileSignature } from "lucide-react";

const opts = queryOptions({
  queryKey: ["projetos"],
  queryFn: async () => (await supabase.from("projetos_lei").select("*").order("ano", { ascending: false }).order("numero", { ascending: false })).data ?? [],
});

export const Route = createFileRoute("/projetos")({
  head: () => ({ meta: [{ title: "Projetos de Lei — Câmara Municipal" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: ProjetosPage,
  errorComponent: ({ error }) => <div className="p-12 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-12 text-center">Não encontrado.</div>,
});

function ProjetosPage() {
  const { data } = useSuspenseQuery(opts);
  return (
    <SiteLayout>
      <PageHero title="Projetos de Lei" subtitle="Projetos em tramitação e aprovados pela Câmara." />
      <section className="container-portal py-12">
        {data.length === 0 ? (
          <div className="text-center py-16"><FileSignature className="h-12 w-12 mx-auto text-gold mb-3" /><p className="text-muted-foreground">Nenhum projeto cadastrado.</p></div>
        ) : (
          <div className="space-y-3">
            {data.map((p: any) => (
              <article key={p.id} className="bg-card border border-border rounded-xl p-5 flex flex-wrap items-start gap-4 justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono font-semibold text-primary">PL {p.numero}/{p.ano}</span>
                    <span className="px-2 py-0.5 bg-muted text-xs rounded">{p.status.replace("_", " ")}</span>
                    {p.autor && <span className="text-xs text-muted-foreground">por {p.autor}</span>}
                  </div>
                  <p className="text-foreground">{p.ementa}</p>
                </div>
                {p.arquivo_url && <a href={p.arquivo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep"><FileText className="h-4 w-4" /> PDF</a>}
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
