import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Flame, ArrowRight, Sparkles, TrendingDown, Award } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/app" });
  }, [user, loading, navigate]);

  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <span className="font-display text-2xl tracking-tight">Fênix</span>
        </div>
        <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition">Entrar</Link>
      </nav>

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-24 text-center sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" /> Método Fênix
        </div>
        <h1 className="mt-8 text-5xl leading-[1.05] sm:text-7xl">
          Das cinzas, <span className="text-gradient-ember">a sua melhor versão</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          Um programa silencioso e premium de emagrecimento e estilo de vida. Sem dietas barulhentas — apenas hábitos que renascem.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-ember px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-ember transition hover:scale-[1.02]"
          >
            Iniciar minha jornada <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-24 grid gap-4 sm:grid-cols-3">
          {[
            { icon: TrendingDown, title: "Progresso visível", desc: "Acompanhe seu peso e calorias com clareza absoluta." },
            { icon: Flame, title: "Diário simples", desc: "Registre refeições em segundos. Sem fricção." },
            { icon: Award, title: "Conquistas", desc: "Desbloqueie selos a cada semana de consistência." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 text-left">
              <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fênix · Renasça
      </footer>
    </main>
  );
}
