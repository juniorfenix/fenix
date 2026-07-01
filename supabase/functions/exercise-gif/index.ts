// Edge Function: exercise-gif
// Validates Supabase JWT (from Authorization header OR ?token= query param),
// then proxies the ExerciseDB GIF endpoint so the RAPIDAPI_KEY never reaches
// the browser. The ?token= fallback is needed for <img src> usage where
// custom request headers cannot be set.
//
// Required secrets (supabase secrets set ...):
//   RAPIDAPI_KEY
//   SUPABASE_SERVICE_ROLE_KEY  (auto-injected by Supabase runtime)
//   SUPABASE_URL               (auto-injected by Supabase runtime)

import { createClient } from "npm:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const VALID_RESOLUTIONS = new Set([180, 360, 720, 1080]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  const url = new URL(req.url);

  // ── 1. Authenticate via JWT (header or ?token= query param) ────────────────
  const authHeader = req.headers.get("Authorization");
  const tokenFromQuery = url.searchParams.get("token");
  const jwt =
    authHeader?.replace("Bearer ", "").trim() ?? tokenFromQuery?.trim() ?? "";

  if (!jwt) {
    return new Response("Unauthorized", { status: 401, headers: CORS_HEADERS });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceKey) {
    return new Response("Internal server error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    return new Response("Unauthorized", { status: 401, headers: CORS_HEADERS });
  }

  // ── 2. Validate params ──────────────────────────────────────────────────────
  const exerciseId = url.searchParams.get("id")?.trim() ?? "";

  if (!exerciseId) {
    return new Response("Missing required param: id", {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  const resolutionRaw = parseInt(url.searchParams.get("resolution") ?? "180");
  if (!VALID_RESOLUTIONS.has(resolutionRaw)) {
    return new Response(
      "Invalid resolution. Must be one of: 180, 360, 720, 1080",
      { status: 400, headers: CORS_HEADERS },
    );
  }

  // ── 3. Proxy GIF from ExerciseDB ────────────────────────────────────────────
  const rapidApiKey = Deno.env.get("RAPIDAPI_KEY");

  if (!rapidApiKey) {
    return new Response("Internal server error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }

  const apiUrl =
    `https://exercisedb.p.rapidapi.com/image?exerciseId=${encodeURIComponent(exerciseId)}&resolution=${resolutionRaw}&rapidapi-key=${rapidApiKey}`;

  let upstream: Response;
  try {
    upstream = await fetch(apiUrl);
  } catch {
    return new Response("Bad gateway", { status: 502, headers: CORS_HEADERS });
  }

  if (!upstream.ok) {
    return new Response("Bad gateway", { status: 502, headers: CORS_HEADERS });
  }

  // Stream the GIF body directly — avoid buffering large files in memory.
  return new Response(upstream.body, {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "image/gif",
      "Cache-Control": "public, max-age=86400",
    },
  });
});
