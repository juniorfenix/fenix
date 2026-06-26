import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
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
const appCss = "/assets/styles-BqMSoCmr.css";
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuthCacheBridge, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
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
const $$splitComponentImporter$f = () => import("./onboarding-BxqGzYIw.mjs");
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
const $$splitComponentImporter$e = () => import("./auth-BgX2B0Wc.mjs");
const Route$e = createFileRoute("/auth")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./app-gHvqyAuc.mjs");
const Route$d = createFileRoute("/app")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./index-bS0X1uxu.mjs");
const Route$c = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./app.index-jAG_SGqh.mjs");
const Route$b = createFileRoute("/app/")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./app.treinos-CVUbFUT8.mjs");
const Route$a = createFileRoute("/app/treinos")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./app.profile-DexMXsLP.mjs");
const Route$9 = createFileRoute("/app/profile")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./app.meu-plano-CufDckGi.mjs");
const Route$8 = createFileRoute("/app/meu-plano")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.method-z82RPCop.mjs");
const Route$7 = createFileRoute("/app/method")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./app.instrutor-huqKlViR.mjs");
const Route$6 = createFileRoute("/app/instrutor")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./app.alimentacao-BGuQPioQ.mjs");
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
const $$splitComponentImporter$4 = () => import("./app.admin-DyqE0q5g.mjs");
const Route$4 = createFileRoute("/app/admin")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./app.instrutor.exercicios-CcxraB1i.mjs");
const Route$3 = createFileRoute("/app/instrutor/exercicios")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./app.instrutor._alunoId-zNFcFoQv.mjs");
const Route$2 = createFileRoute("/app/instrutor/$alunoId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./app.guias._chave-HHxKrLK1.mjs");
const Route$1 = createFileRoute("/app/guias/$chave")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./app.admin._userId-8tZuDx0p.mjs");
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
  Route$2 as R,
  Route$1 as a,
  Route as b,
  router as r,
  supabase as s,
  useAuth as u
};
