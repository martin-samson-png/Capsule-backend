import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createSupabaseUserClient = (accessToken: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
};
