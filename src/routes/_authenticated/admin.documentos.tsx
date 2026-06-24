import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/documentos")({
  component: AdminDocs,
});

const empty = { titulo: "", categoria: "Despesas", ano: new Date().getFullYear(), descricao: "", arquivo_url: "" };

function AdminDocs() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["admin-docs"],
    queryFn: async () => (await supabase.from("documentos_transparencia").select("*").order("ano", { ascending: false })).data ?? [],
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, descricao: form.descricao || null, arquivo_url: form.arquivo_url || null };
      const { error } = editingId
        ? await supabase.from("documentos_transparencia").update(payload).eq("id", editingId)
        : await supabase.from("documentos_transparencia").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-docs"] });
      qc.invalidateQueries({ queryKey: ["docs-transparencia"] });
      setForm(empty); setEditingId(null);
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("documentos_transparencia").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-docs"] }),
  });

  function startEdit(d: any) {
    setEditingId(d.id);
    setForm({ titulo: d.titulo, categoria: d.categoria, ano: d.ano, descricao: d.descricao ?? "", arquivo_url: d.arquivo_url ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="p-8 max-w-6xl space-y-8">
      <div><h1 className="font-display text-3xl font-bold text-primary-deep">Documentos de Transparência</h1><p className="text-muted-foreground mt-1">Publique relatórios, balanços e prestações de contas.</p></div>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-lg font-bold text-primary-deep flex items-center gap-2"><Plus className="h-4 w-4" /> {editingId ? "Editar documento" : "Novo documento"}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label className="text-sm font-medium">Categoria</label>
            <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2">
              <option>Despesas</option><option>Receitas</option><option>Folha de Pagamento</option><option>Licitações</option><option>Contratos</option><option>Relatórios Fiscais</option>
            </select>
          </div>
          <div><label className="text-sm font-medium">Ano</label><input type="number" required value={form.ano} onChange={(e) => setForm({ ...form, ano: Number(e.target.value) })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">URL do arquivo</label><input value={form.arquivo_url} onChange={(e) => setForm({ ...form, arquivo_url: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
        </div>
        <div><label className="text-sm font-medium">Título</label><input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
        <div><label className="text-sm font-medium">Descrição (opcional)</label><textarea rows={2} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
        {save.error && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
        <div className="flex gap-2">
          <button disabled={save.isPending} type="submit" className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep transition disabled:opacity-60">{save.isPending ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty); }} className="inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm border border-border"><X className="h-3 w-3" /> Cancelar</button>}
        </div>
      </form>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-primary-deep"><tr><th className="text-left p-3">Categoria</th><th className="text-left p-3">Ano</th><th className="text-left p-3">Título</th><th className="text-right p-3">Ações</th></tr></thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="p-3">{d.categoria}</td><td className="p-3">{d.ano}</td><td className="p-3">{d.titulo}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => startEdit(d)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border hover:bg-muted"><Pencil className="h-3 w-3" /> Editar</button>
                  <button onClick={() => confirm("Excluir documento?") && del.mutate(d.id)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /> Excluir</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhum documento cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
