import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Types from Supabase
export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  category_id: string | null;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  google_maps_url: string | null;
  logo_url: string | null;
  featured: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  order: number | null;
  created_at: string | null;
}

export interface Review {
  id: string;
  business_id: string | null;
  author_name: string;
  rating: number;
  comment: string | null;
  approved: boolean | null;
  created_at: string | null;
}