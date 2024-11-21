import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';

import { Utilisateur } from '@potentiel-domain/utilisateur';

import { authOptions, convertToken } from '@/auth';
// import * as Sentry from '@sentry/nextjs';

export const getOptionalAuthenticatedUser = async (): Promise<
  Utilisateur.ValueType | undefined
> => {
  const session = await getServerSession({
    callbacks: {
      session: authOptions.callbacks?.session,
    },
  });
  if (session?.utilisateur) {
    return Utilisateur.bind(session.utilisateur);
  }
  const authorizationHeader = headers().get('Authorization');
  if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
    const utilisateur = convertToken(authorizationHeader.slice(7));
    return utilisateur && Utilisateur.bind(utilisateur);
  }
};

export const getAuthenticatedUser = async () => {
  const user = await getOptionalAuthenticatedUser();

  if (!user) {
    // Sentry.setUser(null);
    throw new NoAuthenticatedUserError();
  }

  // Sentry user set up for server side errors
  // Sentry.setUser({
  //   email: user.identifiantUtilisateur.email,
  // });

  return user;
};

export class NoAuthenticatedUserError extends Error {
  constructor(cause?: Error) {
    super(`Authentification obligatoire`, { cause });
  }
}
