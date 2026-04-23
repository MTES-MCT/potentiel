import { headers } from 'next/headers';

import { AuthenticationError } from '@potentiel-applications/bootstrap';
import { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { getSessionUser } from '@/auth/getSessionUser';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: PotentielUtilisateur) => Promise<TResult>,
): Promise<TResult> {
  let utilisateur = getContext()?.utilisateur;

  if (!utilisateur) {
    utilisateur = await getSessionUser({ headers: await headers() });
  }
  if (!utilisateur) {
    throw new AuthenticationError();
  }

  return await action(utilisateur);
}
