import {
  createFileRoute,
  Outlet,
  useNavigate,
  Link,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState, memo, useMemo } from "react";

import { Home, BookOpen, Flame, User, Utensils, Dumbbell, Users, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { profileQuery, perfilQuery } from "@/lib/queries";
import { isAluno, isAdmin, isProfissional } from "@/lib/role-helpers";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

type Tab = { to: string; icon: React.ElementType; label: string; exact: boolean };

const TABS_BASE: Tab[] = [
  { to: "/app", icon: Home, label: "Início", exact: true },
  { to: "/app/treinos", icon: Dumbbell, label: "Treinos", exact: false },
  { to: "/app/alimentacao", icon: Utensils, label: "Alimentação", exact: false },
  { to: "/app/method", icon: BookOpen, label: "Método", exact: false },
  { to: "/app/profile", icon: User, label: "Perfil", exact: false },
];

const TABS_PROFISSIONAL: Tab[] = [
  { to: "/app/instrutor", icon: Users, label: "Alunos", exact: false },
  { to: "/app/profile", icon: User, label: "Perfil", exact: false },
];

const TABS_ADMIN: Tab[] = [
  { to: "/app/admin", icon: Shield, label: "Admin", exact: false },
  { to: "/app/instrutor", icon: Users, label: "Alunos", exact: false },
  { to: "/app/profile", icon: User, label: "Perfil", exact: false },
];

function AppShell() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const userId = user?.id ?? "";

  const { data: profile, isLoading: profileLoading } = useQuery({
    ...profileQuery(userId),
    enabled: !!userId,
  });

  const { data: perfil, isLoading: perfilLoading } = useQuery({
    ...perfilQuery(userId),
    enabled: !!userId,
  });

  const tabs = useMemo<Tab[]>(() => {
    const papel = perfil?.papel;
    if (isAdmin(papel)) return TABS_ADMIN;
    if (isProfissional(papel)) return TABS_PROFISSIONAL;
    return TABS_BASE;
  }, [perfil?.papel]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || profileLoading || perfilLoading || !profile) return;
    // Profissionais e admins não passam pelo onboarding de aluno
    if (isAdmin(perfil?.papel) || isProfissional(perfil?.papel)) return;
    if (!profile.onboarding_complete && !location.pathname.startsWith("/onboarding")) {
      navigate({ to: "/onboarding" });
    }
  }, [user, profile, profileLoading, perfilLoading, perfil?.papel, location.pathname, navigate]);

  useEffect(() => {
    if (loading || !user) return;
    tabs.forEach((t) => {
      router.preloadRoute({ to: t.to }).catch(() => {});
    });
  }, [loading, user, router, tabs]);

  const showSpinner = useDelayedFlag(
    loading || !user || (!!userId && (profileLoading || perfilLoading)),
    200,
  );

  if (loading || !user || (!!userId && (profileLoading || perfilLoading))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {showSpinner ? <Flame className="h-8 w-8 text-primary animate-pulse" /> : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      <SideNav tabs={tabs} />
      <div className="flex-1 min-h-screen pb-24 lg:pb-0 lg:pl-64">
        <Outlet />
      </div>
      <BottomNav tabs={tabs} />
    </div>
  );
}

const SideNav = memo(function SideNav({ tabs }: { tabs: Tab[] }) {
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-border/40 bg-sidebar/70 backdrop-blur-xl px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <Flame className="h-6 w-6 text-primary" strokeWidth={1.6} />
        <span className="font-display text-2xl tracking-tight">Fênix</span>
      </div>
      <nav className="flex flex-col gap-1">
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            preload="intent"
            activeOptions={{ exact: t.exact }}
            activeProps={{ className: "bg-primary/10 text-primary border-primary/30" }}
            inactiveProps={{
              className:
                "text-muted-foreground hover:bg-card hover:text-foreground border-transparent",
            }}
            className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition"
          >
            <t.icon className="h-4.5 w-4.5" strokeWidth={1.7} />
            <span>{t.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-2 text-[11px] text-muted-foreground">Método Fênix · Renasça</div>
    </aside>
  );
});

// Show a flag only after `delayMs` of the condition being true.
// Avoids flash-of-spinner on requests that resolve quickly.
function useDelayedFlag(active: boolean, delayMs: number) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }
    const id = window.setTimeout(() => setShow(true), delayMs);
    return () => window.clearTimeout(id);
  }, [active, delayMs]);
  return show;
}

const BottomNav = memo(function BottomNav({ tabs }: { tabs: Tab[] }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            preload="intent"
            activeOptions={{ exact: t.exact }}
            activeProps={{ className: "text-primary" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="flex flex-col items-center gap-1 text-xs"
          >
            <t.icon className="h-5 w-5" strokeWidth={1.6} />
            <span>{t.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
});
