import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/vereadores")({
  component: AdminVereadores,
});

type V = {
  id: string;
  nome: string;
  cargo: string;
  partido: string | null;
  foto_url: string | null;
  biografia: string | null;
  email: string | null;
  telefone: string | null;
  ordem: number;
  ativo: boolean;
};

const empty = { nome: "", cargo: "Vereador(a)", partido: "", foto_url: "", biografia: "", email: "", telefone: "", ordem: 0, ativo: true };

function AdminVereadores() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<V | null>(null);
  const [form, setForm] = useState(empty);

  const { data = [] } = useQuery({
    queryKey: ["admin-vereadores"],
    queryFn: async () => {
      const { data } = await supabase.from("vereadores").select("*").order("ordem");
      return (data ?? []) as V[];
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        partido: form.partido || null,
        foto_url: form.foto_url || null,
        biografia: form.biografia || null,
        email: form.email || null,
        telefone: form.telefone || null,
      };
      if (editing) {
        const { error } = await supabase.from("vereadores").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vereadores").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vereadores"] });
      qc.invalidateQueries({ queryKey: ["vereadores"] });
      setEditing(null);
      setForm(empty);
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vereadores").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vereadores"] }),
  });

  function startEdit(v: V) {
    setEditing(v);
    setForm({
      nome: v.nome, cargo: v.cargo, partido: v.partido ?? "", foto_url: v.foto_url ?? "",
      biografia: v.biografia ?? "", email: v.email ?? "", telefone: v.telefone ?? "",
      ordem: v.ordem, ativo: v.ativo,
    });
    window.scrollTo(0, 0);
  }

  return (
    <div className="p-8 max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-deep">Vereadores</h1>
        <p className="text-muted-foreground mt-1">Gerencie os perfis dos parlamentares.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(); }} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-lg font-bold text-primary-deep flex items-center gap-2">
          <Plus className="h-4 w-4" /> {editing ? "Editar vereador" : "Novo vereador"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Nome</label><input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Cargo</label><input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Partido</label><input value={form.partido} onChange={(e) => setForm({ ...form, partido: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Ordem</label><input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">E-mail</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Telefone</label><input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div className="md:col-span-2"><label className="text-sm font-medium">URL da foto</label><input value={form.foto_url} onChange={(e) => setForm({ ...form, foto_url: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div className="md:col-span-2"><label className="text-sm font-medium">Biografia</label><textarea rows={4} value={form.biografia} onChange={(e) => setForm({ ...form, biografia: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} /> Ativo (visível no portal)</label>
        {upsert.error && <p className="text-sm text-destructive">{(upsert.error as Error).message}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={upsert.isPending} className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep transition disabled:opacity-60">{upsert.isPending ? "Salvando..." : editing ? "Atualizar" : "Criar"}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="px-5 py-2 rounded-md text-sm border border-border">Cancelar</button>}
        </div>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-primary-deep"><tr><th className="text-left p-3">Ordem</th><th className="text-left p-3">Nome</th><th className="text-left p-3">Cargo</th><th className="text-left p-3">Partido</th><th className="text-left p-3">Status</th><th className="text-right p-3">Ações</th></tr></thead>
          <tbody>
            {data.map((v) => (
              <tr key={v.id} className="border-t border-border">
                <td className="p-3">{v.ordem}</td>
                <td className="p-3 font-medium">{v.nome}</td>
                <td className="p-3 text-muted-foreground">{v.cargo}</td>
                <td className="p-3 text-muted-foreground">{v.partido}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${v.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{v.ativo ? "Ativo" : "Inativo"}</span></td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => startEdit(v)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border hover:bg-muted"><Pencil className="h-3 w-3" /> Editar</button>
                  <button onClick={() => confirm("Excluir vereador?") && del.mutate(v.id)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /> Excluir</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nenhum vereador cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
