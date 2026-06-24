import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, queryOptions } from "@tanstack/react-query";
import {
  ArrowRight,
  FileText,
  Gavel,
  Megaphone,
  ScrollText,
  Search,
  ShieldCheck,
  Users,
  Building2,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-couto.jpg";

const noticiasOptions = queryOptions({
  queryKey: ["noticias", "home"],
  queryFn: async () => {
    const { data } = await supabase
      .from("noticias")
      .select("id, titulo, slug, resumo, imagem_url, data_publicacao")
      .eq("publicada", true)
      .order("data_publicacao", { ascending: false })
      .limit(3);
    return data ?? [];
  },
});

const bannersOptions = queryOptions({
  queryKey: ["banners"],
  queryFn: async () => {
    const { data } = await supabase
      .from("banners_home")
      .select("*")
      .eq("ativo", true)
      .order("ordem")
      .limit(1);
    return data?.[0] ?? null;
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Câmara Municipal de Couto de Magalhães de Minas — Portal Oficial" },
      { name: "description", content: "Portal de integração e transparência da Câmara Municipal de Couto de Magalhães de Minas. Acompanhe sessões, projetos de lei, notícias e dados públicos." },
      { property: "og:title", content: "Câmara Municipal de Couto de Magalhães de Minas" },
      { property: "og:description", content: "Portal oficial do Poder Legislativo Municipal." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(noticiasOptions);
    context.queryClient.prefetchQuery(bannersOptions);
  },
  component: HomePage,
});

const acessoRapido = [
  { label: "Radar da Transparência", icon: ShieldCheck, to: "/transparencia" },
  { label: "Licitações", icon: Gavel, to: "/licitacoes" },
  { label: "Portal de Transparência", icon: FileText, to: "/transparencia" },
  { label: "Publicações", icon: Megaphone, to: "/publicacoes" },
  { label: "Projetos de Lei", icon: ScrollText, to: "/projetos" },
  { label: "Legislação", icon: ScrollText, to: "/leis" },
  { label: "Ouvidoria", icon: Users, to: "/ouvidoria" },
  { label: "e-SIC", icon: Search, to: "/sic" },
];

function HomePage() {
  const { data: noticias } = useSuspenseQuery(noticiasOptions);
  const { data: banner } = useQuery(bannersOptions);

  const heroImage = banner?.imagem_url || heroImg;
  const heroTitle = banner?.titulo || "Transparência e cidadania a serviço de Couto de Magalhães.";
  const heroSubtitle = banner?.subtitulo || "Acompanhe em tempo real as sessões plenárias, projetos de lei, despesas públicas e participe da construção do nosso município.";

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[420px] md:h-[520px] overflow-hidden">
          <img
            src={heroImage}
            alt="Banner principal"
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container-portal text-primary-foreground">
              <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold mb-3">
                Poder Legislativo · Mandato 2025–2028
              </p>
              <h2 className="font-display text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
                {heroTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-primary-foreground/90">
                {heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/transparencia"
                  className="inline-flex items-center gap-2 bg-gold text-gold-foreground px-6 py-3 rounded-md font-semibold text-sm uppercase tracking-wide hover:brightness-110 transition shadow-lg"
                >
                  Portal da Transparência <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/vereadores"
                  className="inline-flex items-center gap-2 border-2 border-primary-foreground/40 px-6 py-3 rounded-md font-semibold text-sm uppercase tracking-wide hover:bg-primary-foreground/10 transition"
                >
                  Conheça os vereadores
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1.5 bg-gold" />
      </section>

      {/* ACESSO RÁPIDO */}
      <section className="py-14 md:py-20">
        <div className="container-portal">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-1">Cidadão</p>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-deep">
                Acesso Rápido
              </h3>
            </div>
            <div className="h-1 flex-1 bg-gradient-to-r from-gold/60 to-transparent rounded-full hidden md:block" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {acessoRapido.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="group bg-card rounded-xl p-6 flex flex-col items-center text-center gap-3 border border-border hover:border-primary transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:bg-gold group-hover:text-gold-foreground transition">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section className="py-14 md:py-20 bg-secondary/40">
        <div className="container-portal">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-1">Comunicação</p>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-deep">
                Últimas Notícias
              </h3>
            </div>
            <Link
              to="/noticias"
              className="text-sm font-semibold text-primary hover:text-gold-foreground inline-flex items-center gap-1"
            >
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {noticias.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
              <Megaphone className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Nenhuma notícia publicada ainda. Em breve novidades aqui.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {noticias.map((n) => (
                <article
                  key={n.id}
                  className="bg-card rounded-xl overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition group"
                >
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
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(n.data_publicacao).toLocaleDateString("pt-BR")}
                    </p>
                    <h4 className="font-display text-lg font-bold text-primary-deep group-hover:text-primary transition line-clamp-2">
                      {n.titulo}
                    </h4>
                    {n.resumo && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {n.resumo}
                      </p>
                    )}
                    <Link
                      to="/noticias/$slug"
                      params={{ slug: n.slug }}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-gold-foreground"
                    >
                      Ler mais <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* INSTITUCIONAL CTA */}
      <section className="py-14 md:py-20">
        <div className="container-portal grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">A Câmara</p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-deep mb-4">
              Um Legislativo aberto, participativo e próximo do cidadão.
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              A Câmara Municipal é a casa do povo. Aqui são debatidas e
              aprovadas as leis que orientam o desenvolvimento de Couto de
              Magalhães de Minas. Nosso compromisso é com a transparência,
              a escuta ativa e a fiscalização responsável do Executivo.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/institucional" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-primary-deep transition">
                Sobre a Câmara
              </Link>
              <Link to="/contato" className="border border-primary text-primary px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition">
                Fale Conosco
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "09", l: "Vereadores" },
              { n: "2025", l: "Início da Legislatura" },
              { n: "100%", l: "Sessões Transparentes" },
              { n: "Mensal", l: "Prestação de Contas" },
            ].map((s) => (
              <div key={s.l} className="bg-card border border-border rounded-xl p-6 text-center shadow-[var(--shadow-card)]">
                <p className="font-display text-3xl font-bold text-primary">{s.n}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
