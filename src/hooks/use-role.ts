import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMyRoles() {
  return useQuery({
    queryKey: ["my-roles"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [] as ("admin" | "editor")[];
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      return (data ?? []).map((r) => r.role as "admin" | "editor");
    },
  });
}
