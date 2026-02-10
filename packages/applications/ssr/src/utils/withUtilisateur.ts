import { AuthenticationError } from '@potentiel-applications/bootstrap';
import { getContext, PotentielUtilisateur } from '@potentiel-applications/request-context';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: PotentielUtilisateur) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = getContext()?.utilisateur;
  if (!utilisateur) {
    throw new AuthenticationError();
  }

  return await action(utilisateur);
}
