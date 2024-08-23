import { Message, MessageHandler } from 'mediateur';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
// import * as Sentry from '@sentry/nextjs';

import { IdentifiantUtilisateur, Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { récupérerUtilisateurAdapter } from '@potentiel-infrastructure/domain-adapters';

import { NoAuthenticatedUserError } from './NoAuthenticatedUser.error';

export type AuthenticatedUserReadModel = {
  nom: string;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  role: Role.ValueType;
  régionDreal: Option.Type<string>;
};

export type GetAuthenticatedUserMessage = Message<
  'System.Authorization.RécupérerUtilisateur',
  {},
  AuthenticatedUserReadModel
>;

const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } = process.env;

export const getOptionalAuthenticatedUser = async (): Promise<
  AuthenticatedUserReadModel | undefined
> => {
  const cookiesContent = cookies();
  const sessionToken = cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value || '';

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET ?? '',
  });

  if (!decoded?.accessToken) {
    return undefined;
  }

  const user = Utilisateur.convertirEnValueType(decoded.accessToken);

  const userBase = {
    identifiantUtilisateur: user.identifiantUtilisateur,
    nom: user.nom,
    role: user.role,
  };

  if (!user.role.estÉgaleÀ(Role.dreal)) {
    return {
      ...userBase,
      régionDreal: Option.none,
    };
  }

  const utilisateur = await récupérerUtilisateurAdapter(user.identifiantUtilisateur.email);

  if (Option.isNone(utilisateur)) {
    return undefined;
  }
  return {
    ...userBase,
    régionDreal: utilisateur.régionDreal ?? 'non-trouvée',
  };
};

export const getAuthenticatedUser: MessageHandler<GetAuthenticatedUserMessage> = async () => {
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
