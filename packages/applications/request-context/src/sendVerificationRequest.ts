import { EmailUserConfig } from 'next-auth/providers/email';

import { SendEmail } from '@potentiel-applications/notifications';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';

import { GetUtilisateurFromEmail } from './getUtilisateur';
import { canConnectWithProvider } from './canConnectWithProvider';

type BuildSendVerificationRequest = (
  sendEmail: SendEmail,
  getUtilisateurFromEmail: GetUtilisateurFromEmail,
) => NonNullable<EmailUserConfig['sendVerificationRequest']>;

export const buildSendVerificationRequest: BuildSendVerificationRequest = (
  sendEmail,
  getUtilisateurFromEmail,
) => {
  const envoyerEmailDeConnexionParEmail = (email: string, url: string) =>
    sendEmail({
      templateId: 6785365,
      messageSubject: 'Connexion à Potentiel',
      recipients: [{ email, fullName: '' }],
      variables: {
        url,
      },
    });

  const envoyerEmailConnexionProConnectObligatoire = (email: string) =>
    sendEmail({
      templateId: 7103248,
      messageSubject: 'Potentiel - Connexion avec ProConnect obligatoire',
      recipients: [{ email, fullName: '' }],
      variables: {
        url: Routes.Auth.signIn({ forceProConnect: true }),
      },
    });

  return async ({ identifier, url }) => {
    const utilisateur = await getUtilisateurFromEmail(identifier);

    const estDésactivé = Option.isSome(utilisateur) && utilisateur.désactivé;
    if (estDésactivé) {
      return;
    }

    if (Option.isNone(utilisateur)) {
      return envoyerEmailDeConnexionParEmail(identifier, url);
    }

    if (canConnectWithProvider('email', utilisateur.role.nom)) {
      return envoyerEmailDeConnexionParEmail(identifier, url);
    }

    if (canConnectWithProvider('proconnect', utilisateur.role.nom)) {
      return envoyerEmailConnexionProConnectObligatoire(identifier);
    }

    return;
  };
};
