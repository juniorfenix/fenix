import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-gradient-ember">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-gradient-ember px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-ember">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-gradient-ember px-4 py-2 text-sm font-medium text-primary-foreground"
          >Tentar novamente</button>
          <a href="/" className="rounded-md border px-4 py-2 text-sm font-medium">Início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
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
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthCacheBridge />
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Clears the React Query cache when the user actually changes (sign-in as
// a different user, or sign-out). Token refreshes / initial restore fire
// SIGNED_IN too — those must NOT wipe the cache.
function AuthCacheBridge() {
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    let lastUserId: string | null | undefined; // undefined = not initialized yet
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextId = session?.user?.id ?? null;
      if (lastUserId === undefined) {
        lastUserId = nextId;
        return;
      }
      if (lastUserId === nextId) return;
      lastUserId = nextId;
      queryClient.clear();
      router.invalidate();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);
  return null;
}

