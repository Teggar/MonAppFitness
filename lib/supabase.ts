import { createClient } from '@supabase/supabase-js'

// REMPLACEZ CES VALEURS PAR VOS VRAIES CLÉS SUPABASE
const supabaseUrl = 'https://gwgfgxkmkkfrfhpqberh.supabase.co' // Par exemple: https://xxxxx.supabase.co
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3Z2ZneGtta2tmcmZocHFiZXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxOTg2MjUsImV4cCI6MjA3Mzc3NDYyNX0.IOy10qiRPGyUTsmomB4Fv0c0BwOboPirtH7AV6qSjD0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)