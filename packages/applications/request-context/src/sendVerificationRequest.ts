import { EmailUserConfig } from 'next-auth/providers/email';

import { SendEmail } from '@potentiel-applications/notifications';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';

import { GetUtilisateurFromEmail } from './getUtilisateur';
import { canConnectWithProvider } from './canConnectWithProvider';
import { getBaseUrl } from './helper/getBaseUrl';

type BuildSendVerificationRequest = (
  sendEmail: SendEmail,
  getUtilisateurFromEmail: GetUtilisateurFromEmail,
) => NonNullable<EmailUserConfig['sendVerificationRequest']>;

export const buildSendVerificationRequest: BuildSendVerificationRequest = (
  sendEmail,
  getUtilisateurFromEmail,
) => {
  const envoyerMagicLink = (email: string, url: string) =>
    sendEmail({
      templateId: 6785365,
      messageSubject: 'Connexion à Potentiel',
      recipients: [{ email, fullName: '' }],
      variables: {
        url,
      },
    });

  const baseUrl = getBaseUrl();

  const envoyerEmailConnexionProConnectObligatoire = (email: string) =>
    sendEmail({
      templateId: 7103248,
      messageSubject: 'Potentiel - Connexion avec ProConnect obligatoire',
      recipients: [{ email, fullName: '' }],
      variables: {
        url: `${baseUrl}${Routes.Auth.signIn({ forceProConnect: true })}`,
      },
    });

  return async ({ identifier, url }) => {
    const utilisateur = await getUtilisateurFromEmail(identifier);

    const estDésactivé = Option.isSome(utilisateur) && utilisateur.désactivé;
    if (estDésactivé) {
      return;
    }

    if (Option.isNone(utilisateur)) {
      return envoyerMagicLink(identifier, url);
    }

    if (canConnectWithProvider('email', utilisateur.rôle.nom)) {
      return envoyerMagicLink(identifier, url);
    }

    if (canConnectWithProvider('proconnect', utilisateur.rôle.nom)) {
      return envoyerEmailConnexionProConnectObligatoire(identifier);
    }

    return;
  };
};
