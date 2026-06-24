import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, User } from "lucide-react";

const vereadoresOptions = queryOptions({
  queryKey: ["vereadores"],
  queryFn: async () => {
    const { data } = await supabase
      .from("vereadores")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true });
    return data ?? [];
  },
});

export const Route = createFileRoute("/vereadores")({
  head: () => ({
    meta: [
      { title: "Vereadores — Câmara Municipal de Couto de Magalhães de Minas" },
      { name: "description", content: "Conheça os vereadores da legislatura atual." },
    ],
  }),
  loader: ({ context }) => context.queryClient.prefetchQuery(vereadoresOptions),
  component: VereadoresPage,
});

function VereadoresPage() {
  const { data: vereadores } = useSuspenseQuery(vereadoresOptions);

  return (
    <SiteLayout>
      <PageHero title="Vereadores" subtitle="Os representantes eleitos pela população de Couto de Magalhães de Minas." />
      <section className="container-portal py-12 md:py-16">
        {vereadores.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Os perfis dos vereadores serão cadastrados em breve pela administração da Câmara.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vereadores.map((v) => (
              <article key={v.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition">
                <div className="aspect-[4/5] bg-muted overflow-hidden">
                  {v.foto_url ? (
                    <img src={v.foto_url} alt={v.nome} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <User className="h-20 w-20 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-gold-foreground/70">{v.cargo}</p>
                  <h3 className="font-display text-xl font-bold text-primary-deep mt-1">{v.nome}</h3>
                  {v.partido && <p className="text-sm text-muted-foreground mt-1">{v.partido}</p>}
                  <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    {v.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {v.email}</p>}
                    {v.telefone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {v.telefone}</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
