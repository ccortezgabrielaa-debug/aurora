import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const LEVELS = ["nano", "micro", "macro"];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Creates a real login for a new ambassador on behalf of the calling brand_admin.
 * Runs with the service role so it can create an auth user and its `profiles` row
 * atomically — a brand_admin can never do this themselves client-side, because
 * inserting into `profiles` is restricted by RLS to `id = auth.uid()` (you can only
 * create your own profile), and creating another user's login at all requires the
 * service role key, which must never reach the browser.
 */
Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Missing Authorization header" }, 401);

  let body: {
    name?: string;
    handle?: string;
    level?: string;
    contact?: string;
    email?: string;
    password?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const name = (body.name ?? "").trim();
  const handle = (body.handle ?? "").trim() || null;
  const level = LEVELS.includes(body.level ?? "") ? body.level! : "nano";
  const contact = (body.contact ?? "").trim() || null;
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";

  if (!name) return json({ error: "name é obrigatório" }, 400);
  if (!email || !password || password.length < 6) {
    return json({ error: "email e password (mínimo 6 caracteres) são obrigatórios" }, 400);
  }

  // Caller-scoped client: identifies the requester and respects their RLS (brand_admin only).
  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user: caller },
  } = await callerClient.auth.getUser();
  if (!caller) return json({ error: "Sessão inválida" }, 401);

  const { data: callerProfile } = await callerClient
    .from("profiles")
    .select("role, brand_id")
    .eq("id", caller.id)
    .maybeSingle();

  if (!callerProfile || callerProfile.role !== "brand_admin" || !callerProfile.brand_id) {
    return json({ error: "Apenas administradores de marca podem convidar embaixadoras" }, 403);
  }

  // Insert the ambassador row through the caller's own RLS-scoped client — the
  // "brand_admin manages ambassadors" policy allows this directly.
  const { data: ambassador, error: ambassadorError } = await callerClient
    .from("ambassadors")
    .insert({ brand_id: callerProfile.brand_id, name, handle, level, contact })
    .select()
    .single();

  if (ambassadorError || !ambassador) {
    return json({ error: "Não foi possível criar a embaixadora: " + ambassadorError?.message }, 400);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: created, error: createUserError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (createUserError || !created.user) {
    return json({ error: "Embaixadora criada, mas o login falhou: " + createUserError?.message }, 400);
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    role: "ambassador",
    ambassador_id: ambassador.id,
    // brand_id is also required here (not just ambassador_id): current_brand_id()
    // reads profiles.brand_id, and the "ambassador reads own brand" RLS policy on
    // `brands` depends on it — without it the ambassador couldn't see their own brand.
    brand_id: callerProfile.brand_id,
    full_name: name,
  });

  if (profileError) {
    return json({ error: "Login criado, mas houve um erro ao vincular o perfil: " + profileError.message }, 400);
  }

  return json({ ambassador, email, ok: true });
});
