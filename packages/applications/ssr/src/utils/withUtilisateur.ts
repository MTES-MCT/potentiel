import {
  getContext,
  NoAuthenticatedUserError,
  PotentielUtilisateur,
} from '@potentiel-applications/request-context';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: PotentielUtilisateur) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = getContext()?.utilisateur;
  if (!utilisateur) {
    throw new NoAuthenticatedUserError();
  }

  return await action(utilisateur);
}
