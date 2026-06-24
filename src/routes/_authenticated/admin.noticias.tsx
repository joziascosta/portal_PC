import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/noticias")({
  component: AdminNoticias,
});

type Noticia = {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo: string;
  imagem_url: string | null;
  publicada: boolean;
  data_publicacao: string;
};

const empty = { titulo: "", slug: "", resumo: "", conteudo: "", imagem_url: "", publicada: false };

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminNoticias() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Noticia | null>(null);
  const [form, setForm] = useState(empty);

  const { data: noticias = [] } = useQuery({
    queryKey: ["admin-noticias"],
    queryFn: async () => {
      const { data } = await supabase.from("noticias").select("*").order("data_publicacao", { ascending: false });
      return (data ?? []) as Noticia[];
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      const payload = { ...form, slug: form.slug || slugify(form.titulo), imagem_url: form.imagem_url || null, resumo: form.resumo || null };
      if (editing) {
        const { error } = await supabase.from("noticias").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("noticias").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-noticias"] });
      qc.invalidateQueries({ queryKey: ["noticias"] });
      setEditing(null);
      setForm(empty);
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("noticias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-noticias"] }),
  });

  const togglePublish = useMutation({
    mutationFn: async (n: Noticia) => {
      const { error } = await supabase.from("noticias").update({ publicada: !n.publicada }).eq("id", n.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-noticias"] });
      qc.invalidateQueries({ queryKey: ["noticias"] });
    },
  });

  function startEdit(n: Noticia) {
    setEditing(n);
    setForm({ titulo: n.titulo, slug: n.slug, resumo: n.resumo ?? "", conteudo: n.conteudo, imagem_url: n.imagem_url ?? "", publicada: n.publicada });
    window.scrollTo(0, 0);
  }

  return (
    <div className="p-8 max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-deep">Notícias</h1>
        <p className="text-muted-foreground mt-1">Crie, edite e publique as notícias do portal.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); upsert.mutate(); }}
        className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-[var(--shadow-card)]"
      >
        <h2 className="font-display text-lg font-bold text-primary-deep flex items-center gap-2">
          <Plus className="h-4 w-4" /> {editing ? "Editar notícia" : "Nova notícia"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value, slug: form.slug || slugify(e.target.value) })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Slug (URL)</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} className="mt-1 w-full bg-muted rounded-md px-3 py-2 font-mono text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Resumo</label>
          <input value={form.resumo} onChange={(e) => setForm({ ...form, resumo: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">URL da imagem (opcional)</label>
          <input value={form.imagem_url} onChange={(e) => setForm({ ...form, imagem_url: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Conteúdo</label>
          <textarea required rows={8} value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.publicada} onChange={(e) => setForm({ ...form, publicada: e.target.checked })} />
          Publicar imediatamente
        </label>
        {upsert.error && <p className="text-sm text-destructive">{(upsert.error as Error).message}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={upsert.isPending} className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep transition disabled:opacity-60">
            {upsert.isPending ? "Salvando..." : editing ? "Atualizar" : "Criar"}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="px-5 py-2 rounded-md text-sm border border-border">Cancelar</button>
          )}
        </div>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-primary-deep">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map((n) => (
              <tr key={n.id} className="border-t border-border">
                <td className="p-3 font-medium">{n.titulo}</td>
                <td className="p-3 text-muted-foreground">{new Date(n.data_publicacao).toLocaleDateString("pt-BR")}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${n.publicada ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {n.publicada ? "Publicada" : "Rascunho"}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => togglePublish.mutate(n)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border hover:bg-muted">
                    {n.publicada ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {n.publicada ? "Despublicar" : "Publicar"}
                  </button>
                  <button onClick={() => startEdit(n)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border hover:bg-muted">
                    <Pencil className="h-3 w-3" /> Editar
                  </button>
                  <button onClick={() => confirm("Excluir notícia?") && del.mutate(n.id)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3 w-3" /> Excluir
                  </button>
                </td>
              </tr>
            ))}
            {noticias.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhuma notícia cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
