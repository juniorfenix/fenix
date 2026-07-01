// Edge Function: exercise-search
// Validates Supabase JWT, proxies ExerciseDB name-search endpoint.
// The RAPIDAPI_KEY never leaves the server.
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

function respond(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function err(message: string, status: number): Response {
  return respond({ error: message }, status);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "GET") {
    return err("Method not allowed", 405);
  }

  // ── 1. Authenticate via Supabase JWT ────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  const jwt = authHeader?.replace("Bearer ", "").trim() ?? "";

  if (!jwt) {
    return err("Unauthorized", 401);
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
    return err("Unauthorized", 401);
  }

  // ── 2. Parse query params ───────────────────────────────────────────────────
  const url = new URL(req.url);
  const name = url.searchParams.get("name")?.trim() ?? "";

  if (!name) {
    return err("Missing required param: name", 400);
  }

  const limit = Math.min(
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "10")),
    50,
  );
  const offset = Math.max(0, parseInt(url.searchParams.get("offset") ?? "0"));

  // ── 3. Call ExerciseDB ──────────────────────────────────────────────────────
  const rapidApiKey = Deno.env.get("RAPIDAPI_KEY");

  if (!rapidApiKey) {
    return new Response("Internal server error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }

  const apiUrl =
    `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(name)}?limit=${limit}&offset=${offset}`;

  let upstream: Response;
  try {
    upstream = await fetch(apiUrl, {
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    });
  } catch {
    return err("Bad gateway", 502);
  }

  if (!upstream.ok) {
    return err("Bad gateway", 502);
  }

  const data = await upstream.json();
  return respond(data);
});
