import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { usePagina } from "@/lib/pagina";

const groups = [
  { t: "Institucional", links: [["Sobre a Câmara", "/institucional"], ["Vereadores", "/vereadores"], ["Contato", "/contato"]] },
  { t: "Atividade Legislativa", links: [["Notícias", "/noticias"], ["Projetos de Lei", "/projetos"], ["Publicações", "/publicacoes"]] },
  { t: "Legislação", links: [["Leis Municipais", "/leis"]] },
  { t: "Transparência", links: [["Portal da Transparência", "/transparencia"], ["Licitações", "/licitacoes"], ["e-SIC", "/sic"], ["Ouvidoria", "/ouvidoria"]] },
] as const;

export const Route = createFileRoute("/mapa-do-site")({
  head: () => ({ meta: [{ title: "Mapa do Site — Câmara Municipal" }] }),
  component: MapaPage,
});

function MapaPage() {
  const { data: pagina } = usePagina("mapa-do-site");
  return (
    <SiteLayout>
      <PageHero title={pagina?.titulo ?? "Mapa do Site"} subtitle="Navegue por todas as seções do portal." />
      <section className="container-portal py-12 md:py-16 space-y-10">
        {pagina?.conteudo && (
          <article className="prose prose-neutral max-w-3xl" dangerouslySetInnerHTML={{ __html: pagina.conteudo }} />
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {groups.map((g) => (
            <div key={g.t}>
              <h3 className="font-display text-lg font-bold text-primary-deep mb-3">{g.t}</h3>
              <ul className="space-y-2 text-sm">
                {g.links.map(([label, to]) => (
                  <li key={to}><Link to={to} className="text-muted-foreground hover:text-primary">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

