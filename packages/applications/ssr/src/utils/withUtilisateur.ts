import {
  getContext,
  NoAuthenticatedUserError,
  UtilisateurPotentiel,
} from '@potentiel-applications/request-context';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: UtilisateurPotentiel) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = getContext()?.utilisateur;
  if (!utilisateur) {
    throw new NoAuthenticatedUserError();
  }

  return await action(utilisateur);
}
