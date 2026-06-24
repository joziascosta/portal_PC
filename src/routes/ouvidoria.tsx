import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { usePagina } from "@/lib/pagina";

export const Route = createFileRoute("/ouvidoria")({
  head: () => ({ meta: [{ title: "Ouvidoria — Câmara Municipal de Couto de Magalhães de Minas" }] }),
  component: OuvidoriaPage,
});

function OuvidoriaPage() {
  const { data } = usePagina("ouvidoria");
  return (
    <SiteLayout>
      <PageHero title={data?.titulo ?? "Ouvidoria"} subtitle="Canal de manifestações, denúncias, sugestões e elogios." />
      <section className="container-portal py-12 md:py-16">
        <article
          className="prose prose-neutral max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data?.conteudo ?? "" }}
        />
      </section>
    </SiteLayout>
  );
}
