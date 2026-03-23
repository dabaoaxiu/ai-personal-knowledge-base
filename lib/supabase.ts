import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types";

let adminClient: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are missing.");
  }

  if (!adminClient) {
    adminClient = createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return adminClient;
}
