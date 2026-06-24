import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Trash2, ShieldCheck, Pencil } from "lucide-react";
import { listUsers, createUser, setUserRole, deleteUser } from "@/lib/admin-users.functions";
import { useMyRoles } from "@/hooks/use-role";

export const Route = createFileRoute("/_authenticated/admin/usuarios")({ component: AdminUsuarios });

function AdminUsuarios() {
  const qc = useQueryClient();
  const { data: myRoles = [] } = useMyRoles();
  const isAdmin = myRoles.includes("admin");
  const list = useServerFn(listUsers);
  const create = useServerFn(createUser);
  const setRole = useServerFn(setUserRole);
  const del = useServerFn(deleteUser);

  const { data: users = [], error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => list({}),
    enabled: isAdmin,
  });

  const [form, setForm] = useState({ email: "", password: "", display_name: "", role: "editor" as "admin" | "editor" });

  const createM = useMutation({
    mutationFn: () => create({ data: form }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); setForm({ email: "", password: "", display_name: "", role: "editor" }); },
  });
  const roleM = useMutation({
    mutationFn: (p: { user_id: string; role: "admin" | "editor" }) => setRole({ data: p }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
  const delM = useMutation({
    mutationFn: (user_id: string) => del({ data: { user_id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  if (!isAdmin) {
    return (
      <div className="p-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-primary-deep">Acesso restrito</h1>
        <p className="text-muted-foreground mt-2">Apenas administradores master podem gerenciar usuários.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-deep flex items-center gap-2"><ShieldCheck className="h-7 w-7" /> Usuários</h1>
        <p className="text-muted-foreground mt-1">Crie contas e defina o nível de acesso: <strong>admin</strong> (master, gerencia tudo) ou <strong>editor</strong> (apenas adiciona conteúdo).</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); createM.mutate(); }} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-lg font-bold text-primary-deep flex items-center gap-2"><Plus className="h-4 w-4" /> Novo usuário</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">E-mail</label><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Nome de exibição</label><input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Senha provisória</label><input required type="text" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Papel</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })} className="mt-1 w-full bg-muted rounded-md px-3 py-2">
              <option value="editor">Editor (apenas conteúdo)</option>
              <option value="admin">Admin master</option>
            </select>
          </div>
        </div>
        {createM.error && <p className="text-sm text-destructive">{(createM.error as Error).message}</p>}
        <button disabled={createM.isPending} type="submit" className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep transition disabled:opacity-60">{createM.isPending ? "Criando..." : "Criar usuário"}</button>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-primary-deep"><tr><th className="text-left p-3">E-mail</th><th className="text-left p-3">Papel</th><th className="text-left p-3">Criado em</th><th className="text-right p-3">Ações</th></tr></thead>
          <tbody>
            {users.map((u) => {
              const role = (u.roles[0] ?? "editor") as "admin" | "editor";
              return (
                <tr key={u.id} className="border-t border-border">
                  <td className="p-3 font-medium">{u.email}</td>
                  <td className="p-3">
                    <select value={role} onChange={(e) => roleM.mutate({ user_id: u.id, role: e.target.value as any })} className="bg-muted rounded-md px-2 py-1 text-xs">
                      <option value="editor">Editor</option>
                      <option value="admin">Admin master</option>
                    </select>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => confirm(`Excluir ${u.email}?`) && delM.mutate(u.id)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /> Excluir</button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhum usuário.</td></tr>}
          </tbody>
        </table>
      </div>
      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
    </div>
  );
}
