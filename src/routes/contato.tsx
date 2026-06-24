import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import { useSiteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Câmara Municipal de Couto de Magalhães de Minas" },
      { name: "description", content: "Entre em contato com a Câmara Municipal." },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const { data } = useSiteConfig();
  const c = data?.contato;

  return (
    <SiteLayout>
      <PageHero title="Fale Conosco" subtitle="Estamos à disposição para atender o cidadão coutense." />
      <section className="container-portal py-12 md:py-16 grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <h2 className="font-display text-2xl font-bold text-primary-deep">Informações de Contato</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3"><MapPin className="h-5 w-5 text-gold mt-0.5" /><div><strong className="block">Endereço</strong> {c?.endereco || "—"}</div></li>
            <li className="flex items-start gap-3"><Phone className="h-5 w-5 text-gold mt-0.5" /><div><strong className="block">Telefone</strong> {c?.telefone || "—"}</div></li>
            <li className="flex items-start gap-3"><Mail className="h-5 w-5 text-gold mt-0.5" /><div><strong className="block">E-mail</strong> {c?.email || "—"}</div></li>
            <li className="flex items-start gap-3"><Clock className="h-5 w-5 text-gold mt-0.5" /><div><strong className="block">Horário</strong> {c?.horario || "—"}</div></li>
          </ul>
        </div>

        <form className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)] space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Mensagem enviada (simulado)."); }}>
          <h2 className="font-display text-xl font-bold text-primary-deep">Envie uma Mensagem</h2>
          <div><label className="text-sm font-medium">Nome</label><input required className="mt-1 w-full bg-muted rounded-md px-3 py-2 outline-none focus:ring-2 ring-primary" /></div>
          <div><label className="text-sm font-medium">E-mail</label><input type="email" required className="mt-1 w-full bg-muted rounded-md px-3 py-2 outline-none focus:ring-2 ring-primary" /></div>
          <div><label className="text-sm font-medium">Assunto</label><input required className="mt-1 w-full bg-muted rounded-md px-3 py-2 outline-none focus:ring-2 ring-primary" /></div>
          <div><label className="text-sm font-medium">Mensagem</label><textarea required rows={5} className="mt-1 w-full bg-muted rounded-md px-3 py-2 outline-none focus:ring-2 ring-primary" /></div>
          <button type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-primary-deep transition"><Send className="h-4 w-4" /> Enviar</button>
        </form>
      </section>
    </SiteLayout>
  );
}
