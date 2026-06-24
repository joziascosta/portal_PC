import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import brasao from "@/assets/brasao.png";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Acesso Administrativo — Câmara Municipal" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-deep via-primary to-primary-deep px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-gold text-sm mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao portal
        </Link>
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary-deep to-primary p-6 text-center">
            <img src={brasao} alt="Brasão" width={64} height={64} className="h-16 w-16 mx-auto" />
            <h1 className="font-display text-lg font-bold text-primary-foreground mt-3">
              Área Administrativa
            </h1>
            <p className="text-xs text-primary-foreground/70 mt-1">
              Câmara Municipal de Couto de Magalhães de Minas
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex bg-muted rounded-md p-1 text-sm">
              <button type="button" onClick={() => setMode("login")} className={`flex-1 py-2 rounded ${mode === "login" ? "bg-card shadow text-primary-deep font-semibold" : "text-muted-foreground"}`}>Entrar</button>
              <button type="button" onClick={() => setMode("signup")} className={`flex-1 py-2 rounded ${mode === "signup" ? "bg-card shadow text-primary-deep font-semibold" : "text-muted-foreground"}`}>Cadastrar</button>
            </div>
            <div>
              <label className="text-sm font-medium">E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full bg-muted rounded-md px-3 py-2 outline-none focus:ring-2 ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium">Senha</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full bg-muted rounded-md px-3 py-2 outline-none focus:ring-2 ring-primary" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button disabled={loading} type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-2.5 font-semibold hover:bg-primary-deep transition disabled:opacity-60">
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              {mode === "signup" && "Após o cadastro, peça a um administrador para conceder permissões."}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
