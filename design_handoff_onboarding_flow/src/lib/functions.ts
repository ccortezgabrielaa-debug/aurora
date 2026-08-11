import { supabase } from './supabase';
import type { Database } from './database.types';

type Ambassador = Database['public']['Tables']['ambassadors']['Row'];

type CreateAmbassadorInput = {
  name: string;
  handle?: string;
  level?: Database['public']['Enums']['ambassador_level'];
  contact?: string;
  email: string;
  password: string;
};

type CreateAmbassadorResult = { ok: true; ambassador: Ambassador; email: string } | { ok: false; error: string };

/** Invokes the `create-ambassador` Edge Function — see its source for why this can't be a plain insert. */
export async function createAmbassadorAccount(input: CreateAmbassadorInput): Promise<CreateAmbassadorResult> {
  const { data, error } = await supabase.functions.invoke('create-ambassador', { body: input });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? error.message;
    return { ok: false, error: message };
  }
  return { ok: true, ambassador: data.ambassador, email: data.email };
}
