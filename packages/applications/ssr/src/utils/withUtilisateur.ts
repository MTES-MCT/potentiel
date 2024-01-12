import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';
import { Utilisateur } from '@potentiel-domain/utilisateur';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: Utilisateur.ValueType) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = await getAuthenticatedUser({});

  return await action(utilisateur);
}
