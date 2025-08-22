import { getContext, NoAuthenticatedUserError } from '@potentiel-applications/request-context';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: Utilisateur.ValueType) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = getContext()?.utilisateur;
  if (!utilisateur) {
    throw new NoAuthenticatedUserError();
  }

  return await action(utilisateur);
}
