import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";

export const Route = createFileRoute("/_authenticated/admin/licitacoes")({ component: AdminLicitacoes });

const empty = { numero: "", modalidade: "Pregão", objeto: "", data_abertura: "", status: "aberta", arquivo_url: "" };

function AdminLicitacoes() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["admin-licitacoes"],
    queryFn: async () => (await supabase.from("licitacoes").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, data_abertura: form.data_abertura || null, arquivo_url: form.arquivo_url || null };
      const { error } = editingId
        ? await supabase.from("licitacoes").update(payload).eq("id", editingId)
        : await supabase.from("licitacoes").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-licitacoes"] }); qc.invalidateQueries({ queryKey: ["licitacoes"] }); setForm(empty); setEditingId(null); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("licitacoes").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-licitacoes"] }),
  });

  function startEdit(l: any) {
    setEditingId(l.id);
    setForm({ numero: l.numero, modalidade: l.modalidade, objeto: l.objeto, data_abertura: l.data_abertura ?? "", status: l.status, arquivo_url: l.arquivo_url ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="p-8 max-w-6xl space-y-8">
      <div><h1 className="font-display text-3xl font-bold text-primary-deep">Licitações</h1><p className="text-muted-foreground mt-1">Cadastre processos licitatórios e seus editais.</p></div>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-lg font-bold text-primary-deep flex items-center gap-2"><Plus className="h-4 w-4" /> {editingId ? "Editar licitação" : "Nova licitação"}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label className="text-sm font-medium">Número</label><input required value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Modalidade</label>
            <select value={form.modalidade} onChange={(e) => setForm({ ...form, modalidade: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2">
              <option>Pregão</option><option>Concorrência</option><option>Tomada de Preços</option><option>Convite</option><option>Dispensa</option><option>Inexigibilidade</option>
            </select></div>
          <div><label className="text-sm font-medium">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2">
              <option value="aberta">Aberta</option><option value="encerrada">Encerrada</option><option value="homologada">Homologada</option><option value="cancelada">Cancelada</option>
            </select></div>
        </div>
        <div><label className="text-sm font-medium">Objeto</label><textarea required rows={3} value={form.objeto} onChange={(e) => setForm({ ...form, objeto: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Data de abertura</label><input type="date" value={form.data_abertura} onChange={(e) => setForm({ ...form, data_abertura: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <FileUpload label="Edital (PDF)" folder="licitacoes" accept="application/pdf" value={form.arquivo_url} onChange={(url) => setForm({ ...form, arquivo_url: url })} />
        </div>
        {save.error && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
        <div className="flex gap-2">
          <button disabled={save.isPending} type="submit" className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep transition disabled:opacity-60">{save.isPending ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty); }} className="inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm border border-border"><X className="h-3 w-3" /> Cancelar</button>}
        </div>
      </form>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-primary-deep"><tr><th className="text-left p-3">Número</th><th className="text-left p-3">Modalidade</th><th className="text-left p-3">Objeto</th><th className="text-left p-3">Status</th><th className="text-right p-3">Ações</th></tr></thead>
          <tbody>
            {data.map((l: any) => (
              <tr key={l.id} className="border-t border-border">
                <td className="p-3 font-medium">{l.numero}</td><td className="p-3">{l.modalidade}</td><td className="p-3 max-w-md truncate">{l.objeto}</td><td className="p-3">{l.status}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => startEdit(l)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border hover:bg-muted"><Pencil className="h-3 w-3" /> Editar</button>
                  <button onClick={() => confirm("Excluir?") && del.mutate(l.id)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /> Excluir</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhuma licitação cadastrada.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
