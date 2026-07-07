import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, e as useLocation, u as useRouter, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, p as profileQuery, a as perfilQuery } from "./router-DSsXXfgN.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as isAdmin, a as isProfissional } from "./role-helpers-CLmabCQJ.mjs";
import "../_libs/sonner.mjs";
import { h as Shield, U as Users, i as User, H as House, j as Dumbbell, k as Utensils, l as BookOpen, F as Flame } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
const TABS_BASE = [{
  to: "/app",
  icon: House,
  label: "Início",
  exact: true
}, {
  to: "/app/treinos",
  icon: Dumbbell,
  label: "Treinos",
  exact: false
}, {
  to: "/app/alimentacao",
  icon: Utensils,
  label: "Alimentação",
  exact: false
}, {
  to: "/app/method",
  icon: BookOpen,
  label: "Método",
  exact: false
}, {
  to: "/app/profile",
  icon: User,
  label: "Perfil",
  exact: false
}];
const TABS_PROFISSIONAL = [{
  to: "/app/instrutor",
  icon: Users,
  label: "Alunos",
  exact: false
}, {
  to: "/app/profile",
  icon: User,
  label: "Perfil",
  exact: false
}];
const TABS_ADMIN = [{
  to: "/app/admin",
  icon: Shield,
  label: "Admin",
  exact: false
}, {
  to: "/app/instrutor",
  icon: Users,
  label: "Alunos",
  exact: false
}, {
  to: "/app/profile",
  icon: User,
  label: "Perfil",
  exact: false
}];
function AppShell() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const userId = user?.id ?? "";
  const {
    data: profile,
    isLoading: profileLoading
  } = useQuery({
    ...profileQuery(userId),
    enabled: !!userId
  });
  const {
    data: perfil,
    isLoading: perfilLoading
  } = useQuery({
    ...perfilQuery(userId),
    enabled: !!userId
  });
  const tabs = reactExports.useMemo(() => {
    const papel = perfil?.papel;
    if (isAdmin(papel)) return TABS_ADMIN;
    if (isProfissional(papel)) return TABS_PROFISSIONAL;
    return TABS_BASE;
  }, [perfil?.papel]);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) navigate({
      to: "/auth"
    });
  }, [user, loading, navigate]);
  reactExports.useEffect(() => {
    if (!user || profileLoading || perfilLoading || !profile) return;
    if (isAdmin(perfil?.papel) || isProfissional(perfil?.papel)) return;
    if (!profile.onboarding_complete && !location.pathname.startsWith("/onboarding")) {
      navigate({
        to: "/onboarding"
      });
    }
  }, [user, profile, profileLoading, perfilLoading, perfil?.papel, location.pathname, navigate]);
  reactExports.useEffect(() => {
    if (loading || !user) return;
    tabs.forEach((t) => {
      router.preloadRoute({
        to: t.to
      }).catch(() => {
      });
    });
  }, [loading, user, router, tabs]);
  const showSpinner = useDelayedFlag(loading || !user || !!userId && (profileLoading || perfilLoading), 200);
  if (loading || !user || !!userId && (profileLoading || perfilLoading)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: showSpinner ? /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-8 w-8 text-primary animate-pulse" }) : null });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen lg:flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SideNav, { tabs }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-h-screen pb-24 lg:pb-0 lg:pl-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { tabs })
  ] });
}
const SideNav = reactExports.memo(function SideNav2({
  tabs
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-border/40 bg-sidebar/70 backdrop-blur-xl px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-6 w-6 text-primary", strokeWidth: 1.6 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl tracking-tight", children: "Fênix" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-1", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, preload: "intent", activeOptions: {
      exact: t.exact
    }, activeProps: {
      className: "bg-primary/10 text-primary border-primary/30"
    }, inactiveProps: {
      className: "text-muted-foreground hover:bg-card hover:text-foreground border-transparent"
    }, className: "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-4.5 w-4.5", strokeWidth: 1.7 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.label })
    ] }, t.to)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto px-2 text-[11px] text-muted-foreground", children: "Método Fênix · Renasça" })
  ] });
});
function useDelayedFlag(active, delayMs) {
  const [show, setShow] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }
    const id = window.setTimeout(() => setShow(true), delayMs);
    return () => window.clearTimeout(id);
  }, [active, delayMs]);
  return show;
}
const BottomNav = reactExports.memo(function BottomNav2({
  tabs
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-md items-center justify-around px-4 py-3", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, preload: "intent", activeOptions: {
    exact: t.exact
  }, activeProps: {
    className: "text-primary"
  }, inactiveProps: {
    className: "text-muted-foreground"
  }, className: "flex flex-col items-center gap-1 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-5 w-5", strokeWidth: 1.6 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.label })
  ] }, t.to)) }) });
});
export {
  AppShell as component
};
