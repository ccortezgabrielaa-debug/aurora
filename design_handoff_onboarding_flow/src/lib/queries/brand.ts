import { supabase } from '../supabase';

/** The signed-in brand_admin's own brand — RLS scopes this to exactly one row. */
export async function fetchMyBrand() {
  const { data } = await supabase.from('brands').select('*').maybeSingle();
  return data;
}
