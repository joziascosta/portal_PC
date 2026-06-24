import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

const paginaOptions = (slug: string) =>
  queryOptions({
    queryKey: ["paginas", slug],
    queryFn: async () => {
      const { data } = await supabase.from("paginas_institucionais").select("*").eq("slug", slug).eq("publicado", true).maybeSingle();
      return data;
    },
  });

export const Route = createFileRoute("/institucional")({
  head: () => ({
    meta: [
      { title: "Institucional — Câmara Municipal de Couto de Magalhães de Minas" },
      { name: "description", content: "Conheça a história, missão, visão e valores da Câmara Municipal." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(paginaOptions("historia")),
  component: InstitucionalPage,
  errorComponent: ({ error }) => <div className="p-12 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-12 text-center">Página não encontrada.</div>,
});

function InstitucionalPage() {
  const { data: pagina } = useSuspenseQuery(paginaOptions("historia"));
  return (
    <SiteLayout>
      <PageHero title={pagina?.titulo || "Institucional"} subtitle="A história, missão e valores do Poder Legislativo Municipal." />
      <section className="container-portal py-12 md:py-16">
        {pagina?.conteudo ? (
          <article className="prose prose-slate max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: pagina.conteudo }} />
        ) : (
          <p className="text-center text-muted-foreground">Conteúdo em breve. Acesse o painel administrativo para editar esta página.</p>
        )}
      </section>
    </SiteLayout>
  );
}
