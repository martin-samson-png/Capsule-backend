import "dotenv/config"
import {createClient} from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
if(!supabaseUrl) throw new Error("Env error : SUPABASE_URL manquant")
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
if(!supabaseAnonKey) throw new Error("Env error : Supabase ANON KEY manquant")

const supabase = createClient(supabaseUrl, supabaseAnonKey)