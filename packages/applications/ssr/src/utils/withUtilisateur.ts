import {
  AuthenticatedUserReadModel,
  getAuthenticatedUser,
} from '@/utils/getAuthenticatedUser.handler';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: AuthenticatedUserReadModel) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = await getAuthenticatedUser({});

  return await action(utilisateur);
}
