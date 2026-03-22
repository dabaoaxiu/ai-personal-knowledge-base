export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  openAIApiKey: process.env.OPENAI_API_KEY ?? "",
  openAIModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini"
};

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function isOpenAIConfigured() {
  return Boolean(env.openAIApiKey);
}
