import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({ component: AdminConfig });

type Contato = { endereco: string; telefone: string; email: string; horario: string };
type LinkRodape = { label: string; url: string };
type Rodape = { sobre: string; links: LinkRodape[] };

function AdminConfig() {
  const qc = useQueryClient();
  const [contato, setContato] = useState<Contato>({ endereco: "", telefone: "", email: "", horario: "" });
  const [rodape, setRodape] = useState<Rodape>({ sobre: "", links: [] });

  const { data } = useQuery({
    queryKey: ["admin-site-config"],
    queryFn: async () => (await supabase.from("site_config").select("*")).data ?? [],
  });

  useEffect(() => {
    if (!data) return;
    const c = data.find((d: any) => d.chave === "contato")?.valor as any;
    const r = data.find((d: any) => d.chave === "rodape")?.valor as any;
    if (c) setContato({ endereco: c.endereco || "", telefone: c.telefone || "", email: c.email || "", horario: c.horario || "" });
    if (r) setRodape({ sobre: r.sobre || "", links: Array.isArray(r.links) ? r.links : [] });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error: e1 } = await supabase.from("site_config").upsert({ chave: "contato", valor: contato as any });
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("site_config").upsert({ chave: "rodape", valor: rodape as any });
      if (e2) throw e2;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-site-config"] }); qc.invalidateQueries({ queryKey: ["site-config"] }); },
  });

  return (
    <div className="p-8 max-w-4xl space-y-8">
      <div><h1 className="font-display text-3xl font-bold text-primary-deep">Configurações Gerais</h1><p className="text-muted-foreground mt-1">Dados de contato e rodapé exibidos em todo o portal.</p></div>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-primary-deep">Contato</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Endereço</label><input value={contato.endereco} onChange={(e) => setContato({ ...contato, endereco: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Telefone</label><input value={contato.telefone} onChange={(e) => setContato({ ...contato, telefone: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">E-mail</label><input value={contato.email} onChange={(e) => setContato({ ...contato, email: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
          <div><label className="text-sm font-medium">Horário</label><input value={contato.horario} onChange={(e) => setContato({ ...contato, horario: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-primary-deep">Rodapé</h2>
        <div><label className="text-sm font-medium">Texto sobre a Câmara</label><textarea rows={3} value={rodape.sobre} onChange={(e) => setRodape({ ...rodape, sobre: e.target.value })} className="mt-1 w-full bg-muted rounded-md px-3 py-2" /></div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Links rápidos</label>
          {rodape.links.map((l, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input placeholder="Rótulo" value={l.label} onChange={(e) => { const ls = [...rodape.links]; ls[i] = { ...ls[i], label: e.target.value }; setRodape({ ...rodape, links: ls }); }} className="bg-muted rounded-md px-3 py-2 text-sm" />
              <input placeholder="/url ou https://..." value={l.url} onChange={(e) => { const ls = [...rodape.links]; ls[i] = { ...ls[i], url: e.target.value }; setRodape({ ...rodape, links: ls }); }} className="bg-muted rounded-md px-3 py-2 text-sm" />
              <button type="button" onClick={() => setRodape({ ...rodape, links: rodape.links.filter((_, j) => j !== i) })} className="px-3 py-2 rounded-md text-xs border border-destructive/40 text-destructive">Remover</button>
            </div>
          ))}
          <button type="button" onClick={() => setRodape({ ...rodape, links: [...rodape.links, { label: "", url: "" }] })} className="text-sm text-primary hover:underline">+ Adicionar link</button>
        </div>
      </section>

      {save.error && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
      <button onClick={() => save.mutate()} disabled={save.isPending} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-primary-deep disabled:opacity-60">
        <Save className="h-4 w-4" /> {save.isPending ? "Salvando..." : save.isSuccess ? "Salvo!" : "Salvar configurações"}
      </button>
    </div>
  );
}
