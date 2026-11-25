import { OperationRejectedError } from '@potentiel-domain/core';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { auth } from '.';
import { impersonateCookieOptions } from './constants';
import { getUtilisateurFromEmail } from './getUtilisateurFromEmail';
import { parseCookie } from './helpers/parseCookie';
import { getLastUsedProvider } from './providers/getLastUsedProvider';
import { getProviderConfiguration } from './providers/getProviderConfiguration';
import type { PotentielUtilisateur } from './utilisateur';

export type GetUtilisateur = (props: {
  headers: Headers;
  ignoreImpersonation?: true;
}) => Promise<PotentielUtilisateur | undefined>;

export const getSessionUser: GetUtilisateur = async ({ headers, ignoreImpersonation }) => {
  const session = await auth.api.getSession({ headers });

  if (!session?.user) {
    return undefined;
  }
  const { email, name: nom } = session.user;
  const providerId = getLastUsedProvider({ headers });

  const accountUrl = providerId && getProviderConfiguration(providerId)?.accountUrl;

  const utilisateur = await getUtilisateur({ email, nom, accountUrl });
  if (ignoreImpersonation) {
    return utilisateur;
  }

  const impersonatedUtilisateur = await getImpersonatedUtilisateur({
    headers,
    email,
    utilisateur,
  });
  return impersonatedUtilisateur ?? utilisateur;
};

type GetImpersonatedUtilisateurProps = {
  headers: Headers;
  email: string;
  utilisateur: PotentielUtilisateur;
};

const getImpersonatedUtilisateur = async ({
  headers,
  email,
  utilisateur,
}: GetImpersonatedUtilisateurProps): Promise<PotentielUtilisateur | undefined> => {
  const cookie = headers.get('cookie');
  const impersonateEmail = decodeURIComponent(
    parseCookie(cookie, impersonateCookieOptions.name) ?? '',
  );

  if (!impersonateEmail) {
    return undefined;
  }

  const stage = process.env.APPLICATION_STAGE;
  if (
    stage === 'production' ||
    stage === 'demo' ||
    !utilisateur.rôle.estAdmin() ||
    !impersonateEmail.endsWith('@test.test')
  ) {
    getLogger('getImpersonatedUtilisateur').warn(`Impersonation attempt blocked`, {
      email,
      impersonateEmail,
      rôle: utilisateur.rôle.nom,
      stage,
    });
    return undefined;
  }

  const impersonatedUser = await getUtilisateur({
    email: impersonateEmail,
    nom: impersonateEmail,
    accountUrl: undefined,
  });

  getLogger('getImpersonatedUtilisateur').info(`Impersonation successful`, {
    email,
    impersonateEmail,
  });

  return { ...impersonatedUser, isImpersonated: true };
};

type GetUtilisateurProps = {
  email: string;
  nom: string;
  accountUrl?: string;
};

const getUtilisateur = async ({ email, nom, accountUrl }: GetUtilisateurProps) => {
  const utilisateur = await getUtilisateurFromEmail(email);
  if (Option.isSome(utilisateur)) {
    if (utilisateur.désactivé) {
      throw new OperationRejectedError(`Forbidden`);
    }
    return {
      ...utilisateur,
      nom,
      accountUrl,
    };
  }

  return {
    ...Utilisateur.convertirEnValueType({ rôle: Role.visiteur.nom, identifiantUtilisateur: email }),
    nom,
    accountUrl,
  };
};
