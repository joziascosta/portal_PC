import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";

const noticiaOptions = (slug: string) =>
  queryOptions({
    queryKey: ["noticia", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("noticias")
        .select("*")
        .eq("slug", slug)
        .eq("publicada", true)
        .maybeSingle();
      if (!data) throw notFound();
      return data;
    },
  });

export const Route = createFileRoute("/noticias/$slug")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(noticiaOptions(params.slug)),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.titulo ?? "Notícia"} — Câmara Municipal` },
      { name: "description", content: loaderData?.resumo ?? "" },
      { property: "og:title", content: loaderData?.titulo ?? "Notícia" },
      ...(loaderData?.imagem_url ? [{ property: "og:image", content: loaderData.imagem_url }] : []),
    ],
  }),
  component: NoticiaPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-portal py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-primary-deep">Notícia não encontrada</h1>
        <Link to="/noticias" className="mt-4 inline-block text-primary hover:underline">Voltar para notícias</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="container-portal py-20 text-center text-muted-foreground">Erro ao carregar a notícia.</div>
    </SiteLayout>
  ),
});

function NoticiaPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(noticiaOptions(slug));

  return (
    <SiteLayout>
      <article className="container-portal py-12 md:py-16 max-w-4xl">
        <Link to="/noticias" className="inline-flex items-center gap-2 text-sm text-primary hover:text-gold-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar para notícias
        </Link>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-foreground/70 mb-2 flex items-center gap-2">
          <Calendar className="h-3 w-3" /> {new Date(data.data_publicacao).toLocaleDateString("pt-BR")}
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-deep leading-tight">{data.titulo}</h1>
        {data.resumo && <p className="mt-4 text-xl text-muted-foreground leading-relaxed">{data.resumo}</p>}
        {data.imagem_url && (
          <img src={data.imagem_url} alt={data.titulo} className="mt-8 w-full rounded-xl shadow-[var(--shadow-elegant)]" />
        )}
        <div className="mt-8 prose prose-lg max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
          {data.conteudo}
        </div>
      </article>
    </SiteLayout>
  );
}
