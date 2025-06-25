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

export const buildSendVerificationRequest: BuildSendVerificationRequest =
  (sendEmail, getUtilisateurFromEmail) =>
  async ({ identifier, url }) => {
    const utilisateur = await getUtilisateurFromEmail(identifier);

    await Option.match(utilisateur)
      .some((utilisateur) => {
        if (utilisateur.désactivé) {
          return;
        }

        if (canConnectWithProvider('email', utilisateur.role.nom)) {
          return sendEmail({
            templateId: 6785365,
            messageSubject: 'Connexion à Potentiel',
            recipients: [{ email: identifier, fullName: '' }],
            variables: {
              url,
            },
          });
        }

        return sendEmail({
          templateId: 7103248,
          messageSubject: 'Potentiel - Connexion avec ProConnect obligatoire',
          recipients: [{ email: identifier, fullName: '' }],
          variables: {
            url: Routes.Auth.signIn({ proConnect: true }),
          },
        });
      })
      .none();
  };
