import { Utilisateur } from '@potentiel-domain/utilisateur';
import { getContext } from '@potentiel-applications/request-context';
import { NoAuthenticatedUserError } from '@potentiel-applications/request-context';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: Utilisateur.ValueType) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = getContext()?.utilisateur;
  if (!utilisateur) {
    throw new NoAuthenticatedUserError();
  }

  return await action(utilisateur);
}
