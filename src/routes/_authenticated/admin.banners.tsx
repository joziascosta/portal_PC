import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Pencil, X } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";

export const Route = createFileRoute("/_authenticated/admin/banners")({ component: AdminBanners });

const empty = { titulo: "", subtitulo: "", imagem_url: "", link_url: "", ordem: 0, ativo: true };

function AdminBanners() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => (await supabase.from("banners_home").select("*").order("ordem")).data ?? [],
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, subtitulo: form.subtitulo || null, link_url: form.link_url || null };
      const { error } = editingId
        ? await supabase.from("banners_home").update(payload).eq("id", editingId)
        : await supabase.from("banners_home").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-banners"] }); qc.invalidateQueries({ queryKey: ["banners"] }); setForm(empty); setEditingId(null); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("banners_home").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-banners"] }),
  });
  const toggle = useMutation({
    mutationFn: async (b: any) => { const { error } = await supabase.from("banners_home").update({ ativo: !b.ativo }).eq("id", b.id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-banners"] }); qc.invalidateQueries({ queryKey: ["banners"] }); },
  });

  function startEdit(b: any) {
    setEditingId(b.id);
    setForm({ titulo: b.titulo, subtitulo: b.subtitulo ?? "", imagem_url: b.imagem_url ?? "", link_url: b.link_url ?? "", ordem: b.ordem, ativo: b.ativo });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="p-8 max-w-6xl space-y-8">
      <div><h1 className="font-display text-3xl font-bold text-primary-deep">Banners da Home</h1><p className="text-muted-foreground mt-1">Imagens e textos do destaque principal da home.</p></div>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-primary-deep flex items-center gap-2"><Plus className="h-4 w-4" /> {editingId ? "Editar banner" : "Novo banner"}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Título</label><input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Subtítulo</label><input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
        </div>
        <FileUpload label="Imagem" folder="banners" accept="image/*" value={form.imagem_url} onChange={(url) => setForm({ ...form, imagem_url: url })} />
        <div className="grid md:grid-cols-[1fr_120px] gap-4">
          <div><label className="text-sm font-medium">Link (opcional)</label><input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="/transparencia" className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Ordem</label><input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
        </div>
        {save.error && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
        <div className="flex gap-2">
          <button disabled={save.isPending || !form.imagem_url} type="submit" className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep transition disabled:opacity-60">{save.isPending ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty); }} className="inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm border border-border"><X className="h-3 w-3" /> Cancelar</button>}
        </div>
      </form>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((b: any) => (
          <div key={b.id} className="bg-card border border-border rounded-xl overflow-hidden">
            {b.imagem_url && <img src={b.imagem_url} alt={b.titulo} className="w-full h-40 object-cover" />}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div><p className="font-display font-bold text-primary-deep">{b.titulo}</p>{b.subtitulo && <p className="text-sm text-muted-foreground">{b.subtitulo}</p>}</div>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${b.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{b.ativo ? "Ativo" : "Inativo"} · #{b.ordem}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={() => startEdit(b)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border hover:bg-muted"><Pencil className="h-3 w-3" /> Editar</button>
                <button onClick={() => toggle.mutate(b)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border hover:bg-muted">{b.ativo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}{b.ativo ? "Desativar" : "Ativar"}</button>
                <button onClick={() => confirm("Excluir banner?") && del.mutate(b.id)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /> Excluir</button>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">Nenhum banner cadastrado. A home usará a imagem padrão.</p>}
      </div>
    </div>
  );
}
