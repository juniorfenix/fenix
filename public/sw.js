// Fênix PWA — Service Worker v2
// Estratégia: cache-first para assets estáticos, network-only para páginas SSR.
// O SW não chama skipWaiting() automaticamente — aguarda o usuário aprovar a atualização.

const CACHE_NAME = "fenix-static-v2";

const PRECACHE = [
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

// ── Install: pré-cacheia assets conhecidos ────────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(PRECACHE.map((url) => cache.add(url)))
      )
    // skipWaiting() removido: o SW aguarda em "waiting" até receber SKIP_WAITING
  );
});

// ── Activate: limpa caches antigos e assume controle ─────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  const isStaticAsset =
    /^\/assets\//.test(url.pathname) ||
    /^\/icons\//.test(url.pathname) ||
    url.pathname === "/manifest.webmanifest";

  if (isStaticAsset) {
    e.respondWith(cacheFirst(request));
  }

  // Páginas SSR → network-only (sem respondWith: browser trata normalmente)
});

// ── Estratégias de fetch ──────────────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}

// ── Mensagens do cliente ──────────────────────────────────────────────────────
// SKIP_WAITING: permite que o cliente dispare a atualização no momento certo.

self.addEventListener("message", (e) => {
  if (e.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
