import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useAccessibility } from "@/hooks/use-accessibility";
import brasao from "@/assets/brasao.png";


type MenuItem = {
  label: string;
  to?: string;
  href?: string;
  children?: { label: string; to?: string; href?: string }[];
};

const menu: MenuItem[] = [
  {
    label: "Institucional",
    to: "/institucional",
    children: [
      { label: "História da Câmara", href: "#" },
      { label: "Estrutura Organizacional", href: "#" },
      { label: "Mesa Diretora", href: "#" },
      { label: "Comissões", href: "#" },
      { label: "Organograma", href: "#" },
      { label: "LGPD", href: "#" },
      { label: "Plano Estratégico", href: "#" },
      { label: "Galeria de Fotos", href: "#" },
      { label: "Galeria de Vídeos", href: "#" },
    ],
  },
  {
    label: "Parlamentares",
    to: "/vereadores",
    children: [
      { label: "Vereadores", to: "/vereadores" },
      { label: "Mesa Diretora", href: "#" },
      { label: "Agenda dos Vereadores", href: "#" },
      { label: "Cotas Parlamentares", href: "#" },
    ],
  },
  {
    label: "Atividade Legislativa",
    href: "#",
    children: [
      { label: "Reuniões Ordinárias", href: "#" },
      { label: "Reuniões Extraordinárias", href: "#" },
      { label: "Pautas das Reuniões", href: "#" },
      { label: "Atas de Reuniões", href: "#" },
      { label: "Pautas das Comissões", href: "#" },
      { label: "Parecer das Comissões", href: "#" },
      { label: "Atas de Posse", href: "#" },
    ],
  },
  {
    label: "Legislação",
    to: "/leis",
    children: [
      { label: "Lei Orgânica Municipal", href: "#" },
      { label: "Regimento Interno", href: "#" },
      { label: "Legislação Municipal", href: "#" },
      { label: "Legislação Estadual", href: "#" },
      { label: "Legislação Federal", href: "#" },
      { label: "Leis da Câmara", to: "/leis" },
      { label: "Portarias", href: "#" },
      { label: "Resoluções", href: "#" },
      { label: "Ofícios", href: "#" },
    ],
  },
  {
    label: "Publicações",
    to: "/publicacoes",
    children: [
      { label: "Notícias", to: "/noticias" },
      { label: "Agenda de Eventos", href: "#" },
      { label: "Boletim Informativo", href: "#" },
      { label: "Diário Oficial", href: "#" },
      { label: "Concursos", href: "#" },
      { label: "Estagiários", href: "#" },
    ],
  },
  {
    label: "Licitações",
    to: "/licitacoes",
    children: [
      { label: "Licitações e Contratos", to: "/licitacoes" },
      { label: "Dispensas", href: "#" },
      { label: "Inexigibilidades", href: "#" },
      { label: "Contratos", href: "#" },
    ],
  },
  {
    label: "Transparência",
    to: "/transparencia",
    children: [
      { label: "Portal da Transparência", to: "/transparencia" },
      { label: "Orçamento e Finanças", href: "#" },
      { label: "Recursos Humanos", href: "#" },
      { label: "Parlamentares e Gabinetes", href: "#" },
      { label: "Dados Abertos", href: "#" },
      { label: "Relatório de Gestão Fiscal (RGF)", href: "#" },
      { label: "Acesso à Informação", to: "/sic" },
      { label: "Responsáveis pelo e-SIC", href: "#" },
      { label: "Pesquisa de Satisfação", href: "#" },
    ],
  },
  {
    label: "Contatos",
    to: "/contato",
    children: [
      { label: "Fale Conosco", to: "/contato" },
      { label: "Ouvidoria", to: "/ouvidoria" },
      { label: "E-SIC", to: "/sic" },
      { label: "Perguntas Frequentes", href: "#" },
    ],
  },
];

const topLinks = [
  { label: "E-SIC", to: "/sic" },
  { label: "Ouvidoria", to: "/ouvidoria" },
  { label: "Transparência", to: "/transparencia" },
  { label: "Mapa do Site", to: "/mapa-do-site" },
];

function ItemLink({
  to,
  href,
  className,
  onClick,
  children,
}: {
  to?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href ?? "#"} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const { contrast, increase, decrease, toggleContrast } = useAccessibility();

  return (
    <header className="w-full">
      {/* Top accessibility bar */}
      <div className="bg-topbar text-topbar-foreground text-xs">
        <div className="container-portal flex flex-wrap items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-3 opacity-90">
            <span>Acessibilidade</span>
            <button type="button" onClick={increase} className="hover:text-gold transition" aria-label="Aumentar fonte">A+</button>
            <button type="button" onClick={decrease} className="hover:text-gold transition" aria-label="Diminuir fonte">A-</button>
            <button type="button" onClick={toggleContrast} aria-pressed={contrast === "high"} className="hover:text-gold transition">Alto Contraste</button>
          </div>
          <nav className="flex items-center gap-4">
            {topLinks.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-gold transition">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Brand bar */}
      <div className="bg-card border-b border-border">
        <div className="container-portal flex items-center justify-between gap-4 py-5">
          <Link to="/" className="flex items-center gap-4 group">
            <img
              src={brasao}
              alt="Brasão de Couto de Magalhães de Minas"
              width={64}
              height={64}
              className="h-14 w-14 object-contain drop-shadow-sm"
            />
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Câmara Municipal de
              </p>
              <h1 className="font-display text-xl md:text-2xl font-bold text-primary-deep">
                Couto de Magalhães de Minas
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-gold-foreground/70">
                Portal de Integração e Transparência · 2025–2028
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 bg-muted rounded-md px-3 py-2 w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Pesquisar no portal..."
              className="bg-transparent text-sm flex-1 outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button
            className="md:hidden p-2 rounded-md bg-primary text-primary-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-primary text-primary-foreground shadow-[0_4px_12px_-6px_rgba(0,0,0,0.25)]">
        <div className={`container-portal ${open ? "block" : "hidden"} md:block`}>
          <ul className="flex flex-col md:flex-row md:items-center md:gap-0">
            {menu.map((item) => {
              const isMobileOpen = mobileOpen === item.label;
              return (
                <li key={item.label} className="md:relative group">
                  <div className="flex items-center md:block">
                    <ItemLink
                      to={item.to}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex-1 block px-4 py-3 text-sm font-medium uppercase tracking-wide hover:bg-primary-deep transition-colors"
                    >
                      <span className="inline-flex items-center gap-1">
                        {item.label}
                        {item.children && (
                          <ChevronDown className="h-3.5 w-3.5 opacity-80 md:transition-transform md:group-hover:rotate-180" />
                        )}
                      </span>
                    </ItemLink>
                    {item.children && (
                      <button
                        type="button"
                        className="md:hidden p-3 text-primary-foreground"
                        aria-label={`Abrir submenu ${item.label}`}
                        onClick={() =>
                          setMobileOpen(isMobileOpen ? null : item.label)
                        }
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isMobileOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {item.children && (
                    <ul
                      className={`
                        md:absolute md:left-0 md:top-full md:min-w-64 md:bg-card md:text-foreground
                        md:shadow-lg md:rounded-b-md md:border md:border-border md:border-t-0
                        md:opacity-0 md:invisible md:translate-y-1 md:transition md:duration-150
                        md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0
                        md:focus-within:opacity-100 md:focus-within:visible md:focus-within:translate-y-0
                        ${isMobileOpen ? "block" : "hidden"} md:block
                        bg-primary-deep md:bg-card z-50
                      `}
                    >
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <ItemLink
                            to={child.to}
                            href={child.href}
                            onClick={() => {
                              setOpen(false);
                              setMobileOpen(null);
                            }}
                            className="block px-4 py-2.5 text-sm md:text-foreground text-primary-foreground hover:bg-muted md:hover:text-primary-deep border-l-2 border-transparent hover:border-gold transition-colors"
                          >
                            {child.label}
                          </ItemLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
