// Auto-fetch de dados de perfil do Instagram a partir do @handle.
//
// Fonte de dados escolhida: Windsor.ai. A integração real (chamada à API do
// Windsor.ai) ainda depende da autorização do conector no claude.ai desta
// conta — enquanto isso não acontece, `fetchInstagramProfile` falha de forma
// previsível com `InstagramFetchUnavailableError`, e as telas que a chamam
// tratam isso como "busca automática indisponível no momento" em vez de
// travar o cadastro (o handle digitado continua sendo salvo normalmente).
export type InstagramProfileData = {
  handle: string;
  fullName: string | null;
  bio: string | null;
  followers: number | null;
  profilePicUrl: string | null;
};

export class InstagramFetchUnavailableError extends Error {}

export function normalizeHandle(raw: string): string {
  return raw.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/.*$/, '');
}

/**
 * Busca os dados públicos do perfil (nome, bio, seguidores, foto) via Windsor.ai.
 * TODO: trocar o corpo desta função pela chamada real assim que o conector
 * Windsor.ai estiver autorizado para esta conta.
 */
export async function fetchInstagramProfile(handleRaw: string): Promise<InstagramProfileData> {
  const handle = normalizeHandle(handleRaw);
  if (!handle) throw new InstagramFetchUnavailableError('Informe um @ do Instagram.');

  throw new InstagramFetchUnavailableError(
    'Busca automática do Instagram ainda não está disponível — conecte o Windsor.ai nas configurações para ativar.',
  );
}
