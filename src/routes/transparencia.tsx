import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { usePagina } from "@/lib/pagina";
import { FileText, Download, ShieldCheck } from "lucide-react";


const docsOptions = queryOptions({
  queryKey: ["docs-transparencia"],
  queryFn: async () => {
    const { data } = await supabase
      .from("documentos_transparencia")
      .select("*")
      .order("ano", { ascending: false })
      .order("data_publicacao", { ascending: false });
    return data ?? [];
  },
});

export const Route = createFileRoute("/transparencia")({
  head: () => ({
    meta: [
      { title: "Transparência — Câmara Municipal de Couto de Magalhães de Minas" },
      { name: "description", content: "Acesso a documentos, balanços, prestação de contas e relatórios de gestão fiscal." },
    ],
  }),
  loader: ({ context }) => context.queryClient.prefetchQuery(docsOptions),
  component: TransparenciaPage,
});

const categorias = ["Despesas", "Receitas", "Folha de Pagamento", "Licitações", "Contratos", "Relatórios Fiscais"];

function TransparenciaPage() {
  const { data: docs } = useSuspenseQuery(docsOptions);
  const { data: pagina } = usePagina("transparencia");

  return (
    <SiteLayout>
      <PageHero title={pagina?.titulo ?? "Portal da Transparência"} subtitle="Informações públicas sobre receitas, despesas, contratos e prestação de contas." />
      <section className="container-portal py-12 md:py-16 space-y-10">
        {pagina?.conteudo && (
          <article className="prose prose-neutral max-w-3xl" dangerouslySetInnerHTML={{ __html: pagina.conteudo }} />
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categorias.map((c) => (
            <div key={c} className="bg-card border border-border rounded-xl p-6 flex items-center gap-3 shadow-[var(--shadow-card)]">
              <ShieldCheck className="h-6 w-6 text-gold" />
              <span className="font-display font-bold text-primary-deep">{c}</span>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-primary-deep mb-4">Documentos Publicados</h2>
          {docs.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Documentos serão disponibilizados em breve.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-primary-deep">
                  <tr>
                    <th className="text-left p-4 font-display">Categoria</th>
                    <th className="text-left p-4 font-display">Ano</th>
                    <th className="text-left p-4 font-display">Título</th>
                    <th className="text-left p-4 font-display">Arquivo</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d) => (
                    <tr key={d.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="p-4">{d.categoria}</td>
                      <td className="p-4">{d.ano}</td>
                      <td className="p-4 text-foreground">{d.titulo}</td>
                      <td className="p-4">
                        {d.arquivo_url ? (
                          <a href={d.arquivo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-gold-foreground">
                            <Download className="h-4 w-4" /> Baixar
                          </a>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
