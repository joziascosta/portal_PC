import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: requer papel admin");
}

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: usersRes, error: e1 } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (e1) throw new Error(e1.message);
    const { data: roles, error: e2 } = await supabaseAdmin.from("user_roles").select("user_id, role");
    if (e2) throw new Error(e2.message);
    return usersRes.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      created_at: u.created_at,
      roles: (roles ?? []).filter((r) => r.user_id === u.id).map((r) => r.role as "admin" | "editor"),
    }));
  });

export const createUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; password: string; role: "admin" | "editor"; display_name?: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { display_name: data.display_name ?? data.email },
    });
    if (error) throw new Error(error.message);
    const uid = created.user!.id;
    const { error: e2 } = await supabaseAdmin.from("user_roles").insert({ user_id: uid, role: data.role });
    if (e2) throw new Error(e2.message);
    return { id: uid };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; role: "admin" | "editor" }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
    const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: data.user_id, role: data.role });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    if (data.user_id === context.userId) throw new Error("Não é possível excluir o próprio usuário.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
