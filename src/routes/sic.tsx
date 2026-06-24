import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { usePagina } from "@/lib/pagina";

export const Route = createFileRoute("/sic")({
  head: () => ({ meta: [{ title: "e-SIC — Câmara Municipal de Couto de Magalhães de Minas" }] }),
  component: SicPage,
});

function SicPage() {
  const { data } = usePagina("sic");
  return (
    <SiteLayout>
      <PageHero title={data?.titulo ?? "e-SIC"} subtitle="Sistema Eletrônico do Serviço de Informação ao Cidadão." />
      <section className="container-portal py-12 md:py-16">
        <article
          className="prose prose-neutral max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data?.conteudo ?? "" }}
        />
      </section>
    </SiteLayout>
  );
}
