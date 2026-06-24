import { useQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Contato = { endereco: string; telefone: string; email: string; horario: string };
export type LinkRodape = { label: string; url: string };
export type Rodape = { sobre: string; links: LinkRodape[] };

export const siteConfigOptions = queryOptions({
  queryKey: ["site-config"],
  queryFn: async () => {
    const { data } = await supabase.from("site_config").select("*");
    const map: Record<string, any> = {};
    (data ?? []).forEach((r: any) => { map[r.chave] = r.valor; });
    return {
      contato: (map.contato ?? {}) as Contato,
      rodape: (map.rodape ?? { sobre: "", links: [] }) as Rodape,
    };
  },
});

export function useSiteConfig() {
  return useQuery(siteConfigOptions);
}
