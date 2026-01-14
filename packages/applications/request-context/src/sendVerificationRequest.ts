import { EmailUserConfig } from 'next-auth/providers/email';

import { EnvoyerNotificationCommand } from '@potentiel-applications/notifications';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';

import { GetUtilisateurFromEmail } from './getUtilisateur';
import { canConnectWithProvider } from './canConnectWithProvider';
import { getBaseUrl } from './helper/getBaseUrl';

type BuildSendVerificationRequest = (
  sendEmail: (options: EnvoyerNotificationCommand['data']) => Promise<void>,
  getUtilisateurFromEmail: GetUtilisateurFromEmail,
) => NonNullable<EmailUserConfig['sendVerificationRequest']>;

export const buildSendVerificationRequest: BuildSendVerificationRequest = (
  sendEmail,
  getUtilisateurFromEmail,
) => {
  const baseUrl = getBaseUrl();

  return async ({ identifier, url }) => {
    const utilisateur = await getUtilisateurFromEmail(identifier);

    const estDésactivé = Option.isSome(utilisateur) && utilisateur.désactivé;
    if (estDésactivé) {
      return;
    }

    if (Option.isNone(utilisateur) || canConnectWithProvider('email', utilisateur.rôle.nom)) {
      await sendEmail({
        key: 'auth/lien-magique',
        recipients: [identifier],
        values: { url },
      });
      return;
    }

    if (canConnectWithProvider('proconnect', utilisateur.rôle.nom)) {
      await sendEmail({
        key: 'auth/proconnect-obligatoire',
        recipients: [identifier],
        values: {
          url: `${baseUrl}${Routes.Auth.signIn({ forceProConnect: true })}`,
        },
      });
    }

    return;
  };
};
