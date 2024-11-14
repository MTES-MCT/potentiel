import { Utilisateur } from '@potentiel-domain/utilisateur';

import { getAuthenticatedUser } from './getAuthenticatedUser.handler';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: Utilisateur.ValueType) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = await getAuthenticatedUser();

  return await action(utilisateur);
}
