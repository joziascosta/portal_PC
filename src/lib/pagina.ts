import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function paginaOptions(slug: string) {
  return queryOptions({
    queryKey: ["pagina", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("paginas_institucionais")
        .select("titulo, conteudo, publicado")
        .eq("slug", slug)
        .maybeSingle();
      return data;
    },
  });
}

export function usePagina(slug: string) {
  return useQuery(paginaOptions(slug));
}
