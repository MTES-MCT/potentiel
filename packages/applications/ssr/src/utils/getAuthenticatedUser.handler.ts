import { Message, MessageHandler } from 'mediateur';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';

import { IdentifiantUtilisateur, Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { récupérerUtilisateurAdapter } from '@potentiel-infrastructure/domain-adapters';

export type AuthenticatedUserReadModel = {
  nom: string;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  role: Role.ValueType;
  régionDreal: Option.Type<string>;
};

export type GetAuthenticatedUserMessage = Message<
  'System.Authorization.RécupérerUtilisateur',
  {},
  Option.Type<AuthenticatedUserReadModel>
>;

const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } = process.env;

export const getOptionalAuthenticatedUser: MessageHandler<
  GetAuthenticatedUserMessage
> = async (): Promise<Option.Type<AuthenticatedUserReadModel>> => {
  const cookiesContent = cookies();
  const sessionToken = cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value || '';

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET ?? '',
  });

  if (!decoded?.accessToken) {
    return Option.none;
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
    return utilisateur;
  }
  return {
    ...userBase,
    régionDreal: utilisateur.régionDreal ?? 'non-trouvée',
  };
};
