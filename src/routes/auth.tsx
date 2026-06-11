import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type Mode = "signin" | "signup" | "reset" | "new_password";

function AuthPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  // Detect password recovery flow (link from reset email)
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("new_password");
    });
    // Also handle case where URL already contains recovery hash on first load
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setMode("new_password");
    }
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading && user && mode !== "new_password") navigate({ to: "/app" });
  }, [user, authLoading, navigate, mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { display_name: name.trim() },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Confirme seu e-mail e entre para começar.");
        setMode("signin");
        setPassword("");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Enviamos um link de redefinição para seu e-mail.");
        setMode("signin");
      } else if (mode === "new_password") {
        if (password.length < 6) {
          toast.error("A senha precisa ter ao menos 6 caracteres.");
          return;
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success("Senha atualizada. Bem-vindo de volta.");
        navigate({ to: "/app" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao autenticar";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };


  const title =
    mode === "signin" ? "Bem-vindo de volta" :
    mode === "signup" ? "Comece a renascer" :
    mode === "new_password" ? "Definir nova senha" :
    "Recuperar acesso";
  const subtitle =
    mode === "signin" ? "Entre para continuar sua jornada." :
    mode === "signup" ? "Crie sua conta gratuita." :
    mode === "new_password" ? "Escolha uma nova senha para entrar." :
    "Enviaremos um link para redefinir sua senha.";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <Flame className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <span className="font-display text-2xl">Fênix</span>
        </Link>

        <div className="glass rounded-3xl p-8">
          <h1 className="text-3xl text-center">{title}</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} />
              </div>
            )}
            {mode !== "new_password" && (
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            )}
            {mode !== "reset" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{mode === "new_password" ? "Nova senha" : "Senha"}</Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-xs text-muted-foreground hover:text-primary transition"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "signup" || mode === "new_password" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
            <Button type="submit" disabled={busy} className="w-full h-12 bg-gradient-ember text-primary-foreground hover:opacity-90 shadow-ember">
              {busy ? "Aguarde…" :
                mode === "signin" ? "Entrar" :
                mode === "signup" ? "Criar conta" :
                mode === "new_password" ? "Salvar nova senha" :
                "Enviar link"}
            </Button>
          </form>

          {mode !== "new_password" && (
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === "signin" ? "Não tem conta? Criar agora" :
                mode === "signup" ? "Já tem conta? Entrar" :
                "Voltar para o login"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
