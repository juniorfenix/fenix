// ExerciseDB API client — all calls go through Supabase Edge Functions.
// The RAPIDAPI_KEY never reaches the browser.

import { supabase } from "@/integrations/supabase/client";

export interface ExerciseDBExercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string[];
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
}

// Reads the current Supabase session token from localStorage synchronously.
// Supabase JS v2 persists sessions as sb-{projectRef}-auth-token where
// projectRef is the subdomain of VITE_SUPABASE_URL.
function readSessionToken(): string {
  if (typeof window === "undefined") return "";
  try {
    const ref = new URL(import.meta.env.VITE_SUPABASE_URL as string).hostname.split(".")[0];
    const raw = localStorage.getItem(`sb-${ref}-auth-token`);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { access_token?: string };
    return parsed.access_token ?? "";
  } catch {
    return "";
  }
}

function edgeFnUrl(name: string): string {
  return `${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/${name}`;
}

/**
 * Searches ExerciseDB exercises by name via the exercise-search Edge Function.
 * Uses the active Supabase session for JWT authentication.
 */
export async function searchExercisesByName(
  name: string,
  limit = 10,
  offset = 0,
): Promise<ExerciseDBExercise[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const params = new URLSearchParams({
    name,
    limit: String(limit),
    offset: String(offset),
  });

  const res = await fetch(`${edgeFnUrl("exercise-search")}?${params}`, {
    headers: {
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar exercícios");
  }

  const json = await res.json();
  return Array.isArray(json) ? (json as ExerciseDBExercise[]) : [];
}

/**
 * Returns the proxied GIF URL for use in <img src>.
 * The JWT token is embedded as ?token= because <img> cannot send custom
 * Authorization headers. The exercise-gif Edge Function accepts either form.
 */
export function getExerciseGifUrl(exerciseId: string, resolution = 180): string {
  const params = new URLSearchParams({
    id: exerciseId,
    resolution: String(resolution),
  });
  const token = readSessionToken();
  if (token) params.set("token", token);
  return `${edgeFnUrl("exercise-gif")}?${params}`;
}
