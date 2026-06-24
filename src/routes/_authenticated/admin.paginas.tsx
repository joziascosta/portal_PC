import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/paginas")({
  component: AdminPaginas,
});

type Pagina = { id: string; slug: string; titulo: string; conteudo: string; ordem: number; publicado: boolean };

function AdminPaginas() {
  const qc = useQueryClient();
  const [sel, setSel] = useState<string | null>(null);
  const [form, setForm] = useState<Pagina | null>(null);
  const [novo, setNovo] = useState({ slug: "", titulo: "" });

  const { data: paginas = [] } = useQuery({
    queryKey: ["admin-paginas"],
    queryFn: async () => {
      const { data } = await supabase.from("paginas_institucionais").select("*").order("ordem");
      return (data ?? []) as Pagina[];
    },
  });

  useEffect(() => {
    if (sel && paginas.length) {
      const p = paginas.find((x) => x.id === sel);
      if (p) setForm(p);
    } else if (!sel && paginas.length && !form) {
      setSel(paginas[0].id);
    }
  }, [sel, paginas]);

  const save = useMutation({
    mutationFn: async () => {
      if (!form) return;
      const { error } = await supabase.from("paginas_institucionais").update({
        titulo: form.titulo, conteudo: form.conteudo, ordem: form.ordem, publicado: form.publicado,
      }).eq("id", form.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-paginas"] });
      qc.invalidateQueries({ queryKey: ["paginas"] });
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const slug = novo.slug.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { error } = await supabase.from("paginas_institucionais").insert({
        slug, titulo: novo.titulo, conteudo: "", ordem: paginas.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-paginas"] }); setNovo({ slug: "", titulo: "" }); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("paginas_institucionais").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-paginas"] }); setSel(null); setForm(null); },
  });

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="font-display text-3xl font-bold text-primary-deep">Páginas Institucionais</h1>
      <p className="text-muted-foreground mt-1">Edite o conteúdo das páginas estáticas do portal.</p>
      <div className="mt-6 grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="bg-card border border-border rounded-xl p-3 space-y-1 h-fit">
          {paginas.map((p) => (
            <button key={p.id} onClick={() => setSel(p.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${sel === p.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              <span className="block font-medium">{p.titulo}</span>
              <span className="block text-xs opacity-70 font-mono">/{p.slug}</span>
            </button>
          ))}
          <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="pt-3 mt-3 border-t border-border space-y-2">
            <input required placeholder="Slug (ex: regimento)" value={novo.slug} onChange={(e) => setNovo({ ...novo, slug: e.target.value })} className="w-full bg-muted rounded-md px-2 py-1.5 text-xs font-mono" />
            <input required placeholder="Título" value={novo.titulo} onChange={(e) => setNovo({ ...novo, titulo: e.target.value })} className="w-full bg-muted rounded-md px-2 py-1.5 text-sm" />
            <button type="submit" className="w-full inline-flex items-center justify-center gap-1 bg-gold text-gold-foreground px-2 py-1.5 rounded-md text-xs font-semibold"><Plus className="h-3 w-3" /> Criar página</button>
          </form>
        </aside>

        {form && (
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-[var(--shadow-card)]">
            <div className="grid md:grid-cols-[1fr_120px_auto] gap-3 items-end">
              <div><label className="text-sm font-medium">Título</label><input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
              <div><label className="text-sm font-medium">Ordem</label><input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
              <label className="flex items-center gap-2 text-sm pb-2"><input type="checkbox" checked={form.publicado} onChange={(e) => setForm({ ...form, publicado: e.target.checked })} /> Publicada</label>
            </div>
            <div>
              <label className="text-sm font-medium">Conteúdo (HTML permitido)</label>
              <textarea rows={20} value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2 font-mono text-sm" />
              <p className="mt-1 text-xs text-muted-foreground">Use parágrafos &lt;p&gt;, títulos &lt;h2&gt;/&lt;h3&gt;, listas &lt;ul&gt;&lt;li&gt;, links &lt;a&gt;, etc.</p>
            </div>
            {save.error && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={save.isPending} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary-deep disabled:opacity-60"><Save className="h-4 w-4" />{save.isPending ? "Salvando..." : "Salvar"}</button>
              <button type="button" onClick={() => confirm("Excluir página?") && del.mutate(form.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-destructive/40 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /> Excluir</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
