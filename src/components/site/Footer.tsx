import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import brasao from "@/assets/brasao.png";
import { useSiteConfig } from "@/lib/site-config";

export function Footer() {
  const { data } = useSiteConfig();
  const contato = data?.contato;
  const rodape = data?.rodape;

  const links = rodape?.links?.length
    ? rodape.links
    : [
        { label: "Transparência", url: "/transparencia" },
        { label: "Legislação", url: "/leis" },
        { label: "Notícias", url: "/noticias" },
        { label: "e-SIC", url: "/sic" },
        { label: "Ouvidoria", url: "/ouvidoria" },
      ];

  return (
    <footer className="bg-topbar text-topbar-foreground mt-16">
      <div className="container-portal py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={brasao} alt="" width={48} height={48} className="h-12 w-12" />
            <div>
              <p className="font-display text-lg font-bold">Câmara Municipal</p>
              <p className="text-sm opacity-80">Couto de Magalhães de Minas — MG</p>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed max-w-md">
            {rodape?.sobre ||
              "Portal oficial de integração e transparência do Poder Legislativo Municipal. Acompanhe sessões, projetos de lei, despesas e canais de participação cidadã."}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gold">Acesso Rápido</h3>
          <ul className="space-y-1.5 text-sm">
            {links.map((l) =>
              l.url.startsWith("/") ? (
                <li key={l.label}><Link to={l.url} className="hover:text-gold">{l.label}</Link></li>
              ) : (
                <li key={l.label}><a href={l.url} target="_blank" rel="noreferrer" className="hover:text-gold">{l.label}</a></li>
              ),
            )}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gold">Contato</h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {contato?.endereco || "Rua Principal, s/n — Centro, Couto de Magalhães de Minas/MG"}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> {contato?.telefone || "(38) 0000-0000"}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> {contato?.email || "contato@camaracouto.mg.gov.br"}</li>
            <li className="flex gap-2"><Clock className="h-4 w-4 mt-0.5 shrink-0" /> {contato?.horario || "Seg a Sex · 08h às 17h"}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-portal py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs opacity-75">
          <p>© {new Date().getFullYear()} Câmara Municipal de Couto de Magalhães de Minas. Todos os direitos reservados.</p>
          <p>Desenvolvido com transparência e responsabilidade pública.</p>
        </div>
      </div>
    </footer>
  );
}
