import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, ScrollText } from "lucide-react";

const leisOptions = queryOptions({
  queryKey: ["leis"],
  queryFn: async () => {
    const { data } = await supabase
      .from("leis")
      .select("*")
      .order("ano", { ascending: false })
      .order("numero", { ascending: false });
    return data ?? [];
  },
});

export const Route = createFileRoute("/leis")({
  head: () => ({
    meta: [
      { title: "Legislação — Câmara Municipal de Couto de Magalhães de Minas" },
      { name: "description", content: "Acesse leis municipais, decretos e resoluções." },
    ],
  }),
  loader: ({ context }) => context.queryClient.prefetchQuery(leisOptions),
  component: LeisPage,
});

function LeisPage() {
  const { data: leis } = useSuspenseQuery(leisOptions);
  return (
    <SiteLayout>
      <PageHero title="Legislação Municipal" subtitle="Leis ordinárias, complementares, decretos e resoluções aprovados pela Câmara." />
      <section className="container-portal py-12 md:py-16">
        {leis.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <ScrollText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Teste</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-primary-deep">
                <tr>
                  <th className="text-left p-4 font-display">Tipo</th>
                  <th className="text-left p-4 font-display">Nº</th>
                  <th className="text-left p-4 font-display">Ano</th>
                  <th className="text-left p-4 font-display">Ementa</th>
                  <th className="text-left p-4 font-display">Arquivo</th>
                </tr>
              </thead>
              <tbody>
                {leis.map((l) => (
                  <tr key={l.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="p-4">{l.tipo}</td>
                    <td className="p-4 font-mono">{l.numero}</td>
                    <td className="p-4">{l.ano}</td>
                    <td className="p-4 text-muted-foreground max-w-xl">{l.ementa}</td>
                    <td className="p-4">
                      {l.arquivo_url ? (
                        <a href={l.arquivo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-gold-foreground">
                          <Download className="h-4 w-4" /> PDF
                        </a>
                      ) : (
                        <span className="text-muted-foreground/60 inline-flex items-center gap-1"><FileText className="h-4 w-4" /> —</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
