import { headers } from 'next/headers';

import { AuthenticationError } from '@potentiel-applications/bootstrap';

import { getSessionUser } from '@/auth/getSessionUser';
import type { PotentielUtilisateur } from '@/auth/utilisateur';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: PotentielUtilisateur) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = await getSessionUser({ headers: await headers() });

  if (!utilisateur) {
    throw new AuthenticationError();
  }

  return await action(utilisateur);
}
