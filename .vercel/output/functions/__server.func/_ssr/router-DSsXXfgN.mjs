import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { R as Root, P as Portal, C as Content, D as Description, a as Close, T as Title, O as Overlay, b as Trigger } from "../_libs/radix-ui__react-dialog.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { X } from "../_libs/lucide-react.mjs";
import { o as objectType, c as coerce } from "../_libs/zod.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
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
const appCss = "/assets/styles-BJwpNm1R.css";
function createSupabaseClient() {
  const SUPABASE_URL = "https://sqcnmqvtbpyryiqhlaja.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxY25tcXZ0YnB5cnlpcWhsYWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTI0NDQsImV4cCI6MjA5NTI2ODQ0NH0.TdYMDriYHNlv-RLmHHZorMQoZyUVDVyZkzuhgoGXn2A";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const Ctx = reactExports.createContext({ user: null, session: null, loading: true, signOut: async () => {
} });
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ctx.Provider,
    {
      value: {
        user: session?.user ?? null,
        session,
        loading,
        signOut: async () => {
          await supabase.auth.signOut();
        }
      },
      children
    }
  );
}
const useAuth = () => reactExports.useContext(Ctx);
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function usePwa() {
  const [isStandalone, setIsStandalone] = reactExports.useState(false);
  const [canInstall, setCanInstall] = reactExports.useState(false);
  const [swUpdated, setSwUpdated] = reactExports.useState(false);
  const [deferredPrompt, setDeferredPrompt] = reactExports.useState(null);
  const [pendingRegistration, setPendingRegistration] = reactExports.useState(null);
  const reloadTriggeredRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    const checkStandalone = () => setIsStandalone(
      mq.matches || navigator.standalone === true
    );
    checkStandalone();
    mq.addEventListener("change", checkStandalone);
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    const onSwUpdateAvailable = (e) => {
      const detail = e.detail;
      setSwUpdated(true);
      if (detail?.registration) setPendingRegistration(detail.registration);
    };
    window.addEventListener("sw:update-available", onSwUpdateAvailable);
    const onMessage = (e) => {
      if (e.data?.type === "SW_UPDATED") setSwUpdated(true);
    };
    navigator.serviceWorker?.addEventListener("message", onMessage);
    const onControllerChange = () => {
      if (reloadTriggeredRef.current) {
        window.location.reload();
      }
    };
    navigator.serviceWorker?.addEventListener("controllerchange", onControllerChange);
    return () => {
      mq.removeEventListener("change", checkStandalone);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("sw:update-available", onSwUpdateAvailable);
      navigator.serviceWorker?.removeEventListener("message", onMessage);
      navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);
  const applyUpdate = reactExports.useCallback(() => {
    if (!pendingRegistration?.waiting) return;
    reloadTriggeredRef.current = true;
    pendingRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
  }, [pendingRegistration]);
  const triggerInstall = reactExports.useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
    return outcome === "accepted";
  }, [deferredPrompt]);
  return { isStandalone, canInstall, swUpdated, triggerInstall, applyUpdate };
}
const TOAST_ID = "pwa-update-available";
function PwaUpdateToast() {
  const { swUpdated, applyUpdate } = usePwa();
  reactExports.useEffect(() => {
    if (!swUpdated) return;
    toast("Nova versão disponível", {
      id: TOAST_ID,
      description: "Atualize para ter as últimas melhorias e correções.",
      duration: Infinity,
      action: {
        label: "Atualizar agora",
        onClick: applyUpdate
      }
    });
  }, [swUpdated, applyUpdate]);
  return null;
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-display text-gradient-ember", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Página não encontrada" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "A página que você procura não existe." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 inline-flex rounded-md bg-gradient-ember px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-ember", children: "Voltar ao início" })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display", children: "Algo deu errado" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-gradient-ember px-4 py-2 text-sm font-medium text-primary-foreground",
          children: "Tentar novamente"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border px-4 py-2 text-sm font-medium", children: "Início" })
    ] })
  ] }) });
}
const Route$g = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fênix — Renasça em sua melhor versão" },
      { name: "description", content: "Aplicativo premium de emagrecimento e estilo de vida. Método Fênix." },
      { name: "theme-color", content: "#1a1614" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "Fênix" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { property: "og:title", content: "Fênix — Renasça em sua melhor versão" },
      { name: "twitter:title", content: "Fênix — Renasça em sua melhor versão" },
      { property: "og:description", content: "Aplicativo premium de emagrecimento e estilo de vida. Método Fênix." },
      { name: "twitter:description", content: "Aplicativo premium de emagrecimento e estilo de vida. Método Fênix." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e5a7c260-f201-41ee-8fbc-3d4805740a7e/id-preview-95c49a34--044aa5fb-3bdc-42ad-be01-5d33cfd76918.lovable.app-1779712430743.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e5a7c260-f201-41ee-8fbc-3d4805740a7e/id-preview-95c49a34--044aa5fb-3bdc-42ad-be01-5d33cfd76918.lovable.app-1779712430743.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600;700&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$g.useRouteContext();
  reactExports.useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let focusCleanup;
    let updateFoundCleanup;
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      const onFocus = () => registration.update().catch(() => {
      });
      window.addEventListener("focus", onFocus);
      focusCleanup = () => window.removeEventListener("focus", onFocus);
      const onUpdateFound = () => {
        const nextSW = registration.installing;
        if (!nextSW) return;
        nextSW.addEventListener("statechange", () => {
          if (nextSW.state === "installed" && navigator.serviceWorker.controller) {
            window.dispatchEvent(
              new CustomEvent("sw:update-available", { detail: { registration } })
            );
          }
        });
      };
      registration.addEventListener("updatefound", onUpdateFound);
      updateFoundCleanup = () => registration.removeEventListener("updatefound", onUpdateFound);
    }).catch(() => {
    });
    return () => {
      focusCleanup?.();
      updateFoundCleanup?.();
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuthCacheBridge, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PwaUpdateToast, {})
  ] }) });
}
function AuthCacheBridge() {
  const router2 = useRouter();
  const { queryClient } = Route$g.useRouteContext();
  reactExports.useEffect(() => {
    let lastUserId;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextId = session?.user?.id ?? null;
      if (lastUserId === void 0) {
        lastUserId = nextId;
        return;
      }
      if (lastUserId === nextId) return;
      lastUserId = nextId;
      queryClient.clear();
      router2.invalidate();
    });
    return () => subscription.unsubscribe();
  }, [router2, queryClient]);
  return null;
}
const $$splitComponentImporter$f = () => import("./onboarding-BCSQy0Ln.mjs");
const Route$f = createFileRoute("/onboarding")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
objectType({
  current_weight: coerce.number({
    invalid_type_error: "Informe o peso"
  }).min(20, "Mínimo 20 kg").max(300, "Máximo 300 kg"),
  goal_weight: coerce.number({
    invalid_type_error: "Informe o peso desejado"
  }).min(20, "Mínimo 20 kg").max(300, "Máximo 300 kg"),
  height: coerce.number({
    invalid_type_error: "Informe a altura"
  }).int("Use números inteiros").min(100, "Mínimo 100 cm").max(250, "Máximo 250 cm"),
  age: coerce.number({
    invalid_type_error: "Informe a idade"
  }).int("Use números inteiros").min(5, "Mínimo 5 anos").max(120, "Máximo 120 anos")
});
const $$splitComponentImporter$e = () => import("./auth-CnskUXko.mjs");
const Route$e = createFileRoute("/auth")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./app-kuXd8WUO.mjs");
const Route$d = createFileRoute("/app")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./index-DlDmt_qu.mjs");
const Route$c = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./app.index-BFSlqmza.mjs");
const Route$b = createFileRoute("/app/")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./app.treinos-8_Fhi6QU.mjs");
const Route$a = createFileRoute("/app/treinos")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./app.profile-BzlbnbL4.mjs");
const Route$9 = createFileRoute("/app/profile")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
function edgeFnUrl(name) {
  return `${"https://sqcnmqvtbpyryiqhlaja.supabase.co"}/functions/v1/${name}`;
}
async function searchExercisesByName(name, limit = 10, offset = 0) {
  const {
    data: { session }
  } = await supabase.auth.getSession();
  const params = new URLSearchParams({
    name,
    limit: String(limit),
    offset: String(offset)
  });
  const res = await fetch(`${edgeFnUrl("exercise-search")}?${params}`, {
    headers: {
      Authorization: `Bearer ${session?.access_token ?? ""}`
    }
  });
  if (!res.ok) {
    throw new Error("Erro ao buscar exercícios");
  }
  const json = await res.json();
  return Array.isArray(json) ? json : [];
}
function isoDaysAgo(days) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("sv-SE");
}
const profileQuery = (userId) => queryOptions({
  queryKey: ["profile", userId],
  queryFn: async () => {
    const { data, error } = await supabase.from("profiles").select(
      "display_name,current_weight,goal_weight,daily_calorie_goal,height,age,gender,activity_level,onboarding_complete,has_seen_welcome"
    ).eq("id", userId).single();
    if (error) throw error;
    return data;
  }
});
const weightsQuery = (userId) => queryOptions({
  queryKey: ["weights", userId],
  queryFn: async () => {
    const { data, error } = await supabase.from("weight_logs").select("logged_date,weight").eq("user_id", userId).order("logged_date", { ascending: true }).limit(30);
    if (error) throw error;
    return (data ?? []).map((r) => ({ logged_date: r.logged_date, weight: Number(r.weight) }));
  }
});
const mealsRecentQuery = (userId) => queryOptions({
  queryKey: ["meals", userId, "recent30"],
  queryFn: async () => {
    const { data, error } = await supabase.from("diario_alimentar").select("id,nome,calorias,refeicao,data,created_at").eq("user_id", userId).gte("data", isoDaysAgo(30)).order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      name: r.nome,
      calories: r.calorias,
      meal_type: r.refeicao ?? "",
      logged_date: r.data,
      created_at: r.created_at ?? ""
    }));
  }
});
const badgesQuery = (userId) => queryOptions({
  queryKey: ["badges", userId],
  queryFn: async () => {
    const { data, error } = await supabase.from("badges").select("badge_type").eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((r) => r.badge_type);
  }
});
const guiasMentaisQuery = queryOptions({
  queryKey: ["guias_mentais"],
  queryFn: async () => {
    const { data, error } = await supabase.from("guias_mentais").select("id,chave,titulo,descricao,conteudo,ordem").order("ordem", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 10 * 60 * 1e3
});
const treinosWeekQuery = (params) => queryOptions({
  queryKey: ["treinos-week", params],
  queryFn: async () => {
    const { data, error } = await supabase.from("treinos").select(
      "id,nivel,genero,local,dia_semana,exercicio,series_repeticoes,observacoes,ordem,url_midia,instrucao,dica_seguranca"
    ).eq("nivel", params.nivel).eq("genero", params.genero).eq("local", params.local).order("dia_semana", { ascending: true }).order("ordem", { ascending: true }).limit(300);
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 10 * 60 * 1e3
});
const perfilQuery = (userId) => queryOptions({
  queryKey: ["perfil", userId],
  queryFn: async () => {
    const { data, error } = await supabase.from("perfis").select("id,nome,papel,especialidade").eq("id", userId).maybeSingle();
    if (error) throw error;
    return data;
  }
});
const instrutorAlunosQuery = (instrutorId) => queryOptions({
  queryKey: ["instrutor-alunos", instrutorId],
  queryFn: async () => {
    const { data, error } = await supabase.from("instrutores_alunos").select("id,aluno_id,created_at,perfis!instrutores_alunos_aluno_id_fkey(nome)").eq("instrutor_id", instrutorId).order("created_at", { ascending: true });
    if (error) throw error;
    const rows = data ?? [];
    const alunoIds = rows.map((r) => r.aluno_id);
    const [profilesMap, treinoMap, dietaMap] = await Promise.all([
      profilesById(alunoIds),
      ultimoTreinoPorAluno(instrutorId, alunoIds),
      ultimaDietaPorAluno(instrutorId, alunoIds)
    ]);
    return rows.map((row) => {
      const r = row;
      const profile = profilesMap.get(r.aluno_id);
      return {
        id: r.id,
        aluno_id: r.aluno_id,
        aluno_nome: r.perfis?.nome ?? profile?.display_name ?? null,
        aluno_email: profile?.email ?? null,
        created_at: r.created_at ?? "",
        ultimo_treino_em: treinoMap.get(r.aluno_id) ?? null,
        ultima_dieta_em: dietaMap.get(r.aluno_id) ?? null
      };
    });
  }
});
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const alunosBuscaQuery = (instrutorId, termo) => queryOptions({
  queryKey: ["alunos-busca", instrutorId, termo.trim()],
  queryFn: async () => {
    const clean = termo.trim();
    if (!clean || clean.length < 2 && !UUID_RE.test(clean)) return [];
    const queryProfiles = async (column) => {
      const query = supabase.from("profiles").select("id,display_name,email").limit(8);
      if (column === "id") return query.eq("id", clean);
      return query.ilike(column, `%${clean}%`);
    };
    const profileRequests = UUID_RE.test(clean) ? [queryProfiles("id")] : [queryProfiles("display_name"), queryProfiles("email")];
    const profileResponses = await Promise.all(profileRequests);
    const firstError = profileResponses.find((res) => res.error)?.error;
    if (firstError) throw firstError;
    const profiles = /* @__PURE__ */ new Map();
    for (const res of profileResponses) {
      for (const p of res.data ?? []) profiles.set(p.id, p);
    }
    const ids = [...profiles.keys()];
    if (ids.length === 0) return [];
    const [{ data: perfis, error: perfilError }, { data: vinculos, error: vinculoError }] = await Promise.all([
      supabase.from("perfis").select("id,nome,papel").in("id", ids),
      supabase.from("instrutores_alunos").select("aluno_id").eq("instrutor_id", instrutorId).in("aluno_id", ids)
    ]);
    if (perfilError) throw perfilError;
    if (vinculoError) throw vinculoError;
    const perfilMap = new Map((perfis ?? []).map((p) => [p.id, p]));
    const vinculados = new Set((vinculos ?? []).map((v) => v.aluno_id));
    return ids.map((id) => {
      const profile = profiles.get(id);
      const perfil = perfilMap.get(id);
      return {
        id,
        nome: perfil?.nome ?? profile?.display_name ?? null,
        email: profile?.email ?? null,
        papel: perfil?.papel ?? "aluno",
        vinculado: vinculados.has(id)
      };
    }).filter((aluno) => aluno.papel === "aluno");
  }
});
async function profilesById(ids) {
  const map = /* @__PURE__ */ new Map();
  if (ids.length === 0) return map;
  const { data, error } = await supabase.from("profiles").select("id,display_name,email").in("id", ids);
  if (error) throw error;
  for (const profile of data ?? []) map.set(profile.id, profile);
  return map;
}
async function ultimoTreinoPorAluno(instrutorId, alunoIds) {
  const map = /* @__PURE__ */ new Map();
  if (alunoIds.length === 0) return map;
  const { data: planos, error: planosError } = await supabase.from("planos_treino").select("id,aluno_id").eq("instrutor_id", instrutorId).in("aluno_id", alunoIds);
  if (planosError) throw planosError;
  const planoAluno = new Map((planos ?? []).map((p) => [p.id, p.aluno_id]));
  const planoIds = [...planoAluno.keys()];
  if (planoIds.length === 0) return map;
  const { data, error } = await supabase.from("plano_treino_conclusoes").select("plano_id,aluno_id,data,created_at").in("plano_id", planoIds).order("created_at", { ascending: false }).limit(80);
  if (error) throw error;
  for (const row of data ?? []) {
    if (!map.has(row.aluno_id)) map.set(row.aluno_id, row.data);
  }
  return map;
}
async function ultimaDietaPorAluno(instrutorId, alunoIds) {
  const map = /* @__PURE__ */ new Map();
  if (alunoIds.length === 0) return map;
  const { data: planos, error: planosError } = await supabase.from("planos_alimentares").select("id,aluno_id").eq("instrutor_id", instrutorId).in("aluno_id", alunoIds);
  if (planosError) throw planosError;
  const planoAluno = new Map((planos ?? []).map((p) => [p.id, p.aluno_id]));
  const planoIds = [...planoAluno.keys()];
  if (planoIds.length === 0) return map;
  const { data, error } = await supabase.from("plano_alimentar_adesao").select("plano_id,aluno_id,data,created_at").in("plano_id", planoIds).order("created_at", { ascending: false }).limit(80);
  if (error) throw error;
  for (const row of data ?? []) {
    if (!map.has(row.aluno_id)) map.set(row.aluno_id, row.data);
  }
  return map;
}
const avisosInstrutorQuery = (instrutorId) => queryOptions({
  queryKey: ["avisos-instrutor", instrutorId],
  queryFn: async () => {
    const { data, error } = await supabase.from("notificacoes_instrutor").select(
      "id,tipo,aluno_id,plano_id,titulo,corpo,data_ref,lida,created_at,perfis!notificacoes_instrutor_aluno_id_fkey(nome)"
    ).eq("instrutor_id", instrutorId).order("created_at", { ascending: false }).limit(20);
    if (error) throw error;
    return (data ?? []).map((row) => {
      const r = row;
      return {
        id: r.id,
        tipo: r.tipo,
        aluno_id: r.aluno_id,
        aluno_nome: r.perfis?.nome ?? null,
        plano_id: r.plano_id ?? null,
        titulo: r.titulo,
        corpo: r.corpo ?? null,
        data_ref: r.data_ref ?? null,
        lida: Boolean(r.lida),
        created_at: r.created_at
      };
    });
  },
  refetchInterval: 3e4
});
const planosTreinoAlunoQuery = (alunoId) => queryOptions({
  queryKey: ["planos-treino-aluno", alunoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_treino").select("id,instrutor_id,aluno_id,nome,nivel,dias_semana,ativo,created_at").eq("aluno_id", alunoId).eq("ativo", true).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const planosTreinoInstrutorQuery = (instrutorId, alunoId) => queryOptions({
  queryKey: ["planos-treino-instrutor", instrutorId, alunoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_treino").select("id,instrutor_id,aluno_id,nome,nivel,dias_semana,ativo,created_at").eq("instrutor_id", instrutorId).eq("aluno_id", alunoId).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const planoExerciciosQuery = (planoId) => queryOptions({
  queryKey: ["plano-exercicios", planoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_treino_exercicios").select(
      "id,plano_id,dia_semana,series,repeticoes,descanso_seg,ordem,observacoes,exercicios(id,nome,grupo_muscular,gif_url,video_url,tipo_midia,descricao,nivel,equipamento)"
    ).eq("plano_id", planoId).order("dia_semana", { ascending: true }).order("ordem", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => {
      const r = row;
      const { exercicios, ...rest } = r;
      return {
        ...rest,
        exercicio: exercicios
      };
    });
  }
});
const planosAlimentaresAlunoQuery = (alunoId) => queryOptions({
  queryKey: ["planos-alimentares-aluno", alunoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_alimentares").select(
      "id,instrutor_id,aluno_id,nome,descricao,meta_kcal,meta_proteinas_g,meta_carboidratos_g,meta_gorduras_g,ativo,created_at"
    ).eq("aluno_id", alunoId).eq("ativo", true).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const planosAlimentaresInstrutorQuery = (instrutorId, alunoId) => queryOptions({
  queryKey: ["planos-alimentares-instrutor", instrutorId, alunoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_alimentares").select(
      "id,instrutor_id,aluno_id,nome,descricao,meta_kcal,meta_proteinas_g,meta_carboidratos_g,meta_gorduras_g,ativo,created_at"
    ).eq("instrutor_id", instrutorId).eq("aluno_id", alunoId).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const planosTreinoInstrutorCountQuery = (instrutorId) => queryOptions({
  queryKey: ["planos-treino-instrutor-count", instrutorId],
  queryFn: async () => {
    const { count, error } = await supabase.from("planos_treino").select("id", { count: "exact", head: true }).eq("instrutor_id", instrutorId);
    if (error) throw error;
    return count ?? 0;
  }
});
const planosAlimentaresInstrutorCountQuery = (instrutorId) => queryOptions({
  queryKey: ["planos-alimentares-instrutor-count", instrutorId],
  queryFn: async () => {
    const { count, error } = await supabase.from("planos_alimentares").select("id", { count: "exact", head: true }).eq("instrutor_id", instrutorId);
    if (error) throw error;
    return count ?? 0;
  }
});
const planoRefeicoesQuery = (planoId) => queryOptions({
  queryKey: ["plano-refeicoes", planoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("plano_alimentar_refeicoes").select(
      "id,plano_id,refeicao,horario,descricao,kcal,proteina_g,ordem,observacoes,created_at"
    ).eq("plano_id", planoId).order("ordem", { ascending: true }).order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }
});
const exerciciosQuery = queryOptions({
  queryKey: ["exercicios"],
  queryFn: async () => {
    const { data, error } = await supabase.from("exercicios").select("id,nome,grupo_muscular,nivel,equipamento,gif_url,video_url,tipo_midia,descricao").order("nome", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 10 * 60 * 1e3
});
const conclusoesTreinoQuery = (planoId, alunoId, days = 30) => queryOptions({
  queryKey: ["conclusoes-treino", planoId, alunoId, days],
  queryFn: async () => {
    const desde = /* @__PURE__ */ new Date();
    desde.setDate(desde.getDate() - days);
    const { data, error } = await supabase.from("plano_treino_conclusoes").select("id,plano_id,aluno_id,dia_semana,data").eq("plano_id", planoId).eq("aluno_id", alunoId).gte("data", desde.toISOString().slice(0, 10)).order("data", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const adesaoAlimentarQuery = (planoId, alunoId, days = 30) => queryOptions({
  queryKey: ["adesao-alimentar", planoId, alunoId, days],
  queryFn: async () => {
    const desde = /* @__PURE__ */ new Date();
    desde.setDate(desde.getDate() - days);
    const { data, error } = await supabase.from("plano_alimentar_adesao").select("id,plano_id,aluno_id,data").eq("plano_id", planoId).eq("aluno_id", alunoId).gte("data", desde.toISOString().slice(0, 10)).order("data", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const exerciseDbSearchQuery = (name) => queryOptions({
  queryKey: ["exercisedb-search", name],
  queryFn: () => searchExercisesByName(name),
  staleTime: 24 * 60 * 60 * 1e3,
  gcTime: 60 * 60 * 1e3,
  enabled: name.trim().length >= 2
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Dialog = Root;
const DialogTrigger = Trigger;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
  const fallbackId = reactExports.useId();
  const describedBy = ariaDescribedBy ?? fallbackId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        ref,
        "aria-describedby": describedBy,
        className: cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
          className
        ),
        ...props,
        children: [
          children,
          !ariaDescribedBy && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: fallbackId, className: "sr-only", children: "Caixa de diálogo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
});
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const $$splitComponentImporter$8 = () => import("./app.meu-plano-wMf-xOYI.mjs");
const Route$8 = createFileRoute("/app/meu-plano")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.method-Blq85dfY.mjs");
const Route$7 = createFileRoute("/app/method")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./app.instrutor-a_cqQ2DR.mjs");
const Route$6 = createFileRoute("/app/instrutor")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./app.alimentacao-Cui7eIMp.mjs");
const Route$5 = createFileRoute("/app/alimentacao")({
  head: () => ({
    meta: [{
      title: "Minha Alimentação"
    }, {
      name: "description",
      content: "Metas nutricionais, progresso diário e registro de refeições."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./app.admin-BMFlVwmB.mjs");
const Route$4 = createFileRoute("/app/admin")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./app.instrutor.exercicios-CsX64U1u.mjs");
const Route$3 = createFileRoute("/app/instrutor/exercicios")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./app.instrutor._alunoId-ChRQPy6N.mjs");
const Route$2 = createFileRoute("/app/instrutor/$alunoId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./app.guias._chave-CVxVqLnd.mjs");
const Route$1 = createFileRoute("/app/guias/$chave")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./app.admin._userId-Dy9kAmtp.mjs");
const Route = createFileRoute("/app/admin/$userId")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const OnboardingRoute = Route$f.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$g
});
const AuthRoute = Route$e.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$g
});
const AppRoute = Route$d.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$g
});
const IndexRoute = Route$c.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$g
});
const AppIndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppRoute
});
const AppTreinosRoute = Route$a.update({
  id: "/treinos",
  path: "/treinos",
  getParentRoute: () => AppRoute
});
const AppProfileRoute = Route$9.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AppRoute
});
const AppMeuPlanoRoute = Route$8.update({
  id: "/meu-plano",
  path: "/meu-plano",
  getParentRoute: () => AppRoute
});
const AppMethodRoute = Route$7.update({
  id: "/method",
  path: "/method",
  getParentRoute: () => AppRoute
});
const AppInstrutorRoute = Route$6.update({
  id: "/instrutor",
  path: "/instrutor",
  getParentRoute: () => AppRoute
});
const AppAlimentacaoRoute = Route$5.update({
  id: "/alimentacao",
  path: "/alimentacao",
  getParentRoute: () => AppRoute
});
const AppAdminRoute = Route$4.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AppRoute
});
const AppInstrutorExerciciosRoute = Route$3.update({
  id: "/exercicios",
  path: "/exercicios",
  getParentRoute: () => AppInstrutorRoute
});
const AppInstrutorAlunoIdRoute = Route$2.update({
  id: "/$alunoId",
  path: "/$alunoId",
  getParentRoute: () => AppInstrutorRoute
});
const AppGuiasChaveRoute = Route$1.update({
  id: "/guias/$chave",
  path: "/guias/$chave",
  getParentRoute: () => AppRoute
});
const AppAdminUserIdRoute = Route.update({
  id: "/$userId",
  path: "/$userId",
  getParentRoute: () => AppAdminRoute
});
const AppAdminRouteChildren = {
  AppAdminUserIdRoute
};
const AppAdminRouteWithChildren = AppAdminRoute._addFileChildren(
  AppAdminRouteChildren
);
const AppInstrutorRouteChildren = {
  AppInstrutorAlunoIdRoute,
  AppInstrutorExerciciosRoute
};
const AppInstrutorRouteWithChildren = AppInstrutorRoute._addFileChildren(
  AppInstrutorRouteChildren
);
const AppRouteChildren = {
  AppAdminRoute: AppAdminRouteWithChildren,
  AppAlimentacaoRoute,
  AppInstrutorRoute: AppInstrutorRouteWithChildren,
  AppMethodRoute,
  AppMeuPlanoRoute,
  AppProfileRoute,
  AppTreinosRoute,
  AppIndexRoute,
  AppGuiasChaveRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AppRoute: AppRouteWithChildren,
  AuthRoute,
  OnboardingRoute
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 6e4,
        // 1 min — cache hits feel instant on revisit
        gcTime: 5 * 6e4,
        // keep in memory for 5 min after unmount
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    // hover/touchstart preloads route + loader
    defaultPreloadStaleTime: 0,
    // let Query manage freshness
    defaultPreloadDelay: 0
    // fire immediately on intent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  planoRefeicoesQuery as A,
  exerciciosQuery as B,
  exerciseDbSearchQuery as C,
  Dialog as D,
  planosTreinoInstrutorQuery as E,
  planosAlimentaresInstrutorQuery as F,
  Route$1 as G,
  Route as H,
  router as I,
  Route$2 as R,
  perfilQuery as a,
  DialogTrigger as b,
  cn as c,
  DialogContent as d,
  DialogHeader as e,
  DialogTitle as f,
  planosTreinoInstrutorCountQuery as g,
  planosAlimentaresInstrutorCountQuery as h,
  instrutorAlunosQuery as i,
  avisosInstrutorQuery as j,
  badgesQuery as k,
  guiasMentaisQuery as l,
  mealsRecentQuery as m,
  planosTreinoAlunoQuery as n,
  DialogDescription as o,
  profileQuery as p,
  planoExerciciosQuery as q,
  conclusoesTreinoQuery as r,
  supabase as s,
  treinosWeekQuery as t,
  useAuth as u,
  alunosBuscaQuery as v,
  weightsQuery as w,
  DialogFooter as x,
  planosAlimentaresAlunoQuery as y,
  adesaoAlimentarQuery as z
};
