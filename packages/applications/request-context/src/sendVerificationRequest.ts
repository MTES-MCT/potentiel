import { EmailUserConfig } from 'next-auth/providers/email';

import { SendEmail } from '@potentiel-applications/notifications';
import { Option } from '@potentiel-libraries/monads';

import { GetUtilisateurFromEmail } from './getUtilisateur';

type BuildSendVerificationRequest = (
  sendEmail: SendEmail,
  getUtilisateurFromEmail: GetUtilisateurFromEmail,
) => NonNullable<EmailUserConfig['sendVerificationRequest']>;

export const buildSendVerificationRequest: BuildSendVerificationRequest =
  (sendEmail, getUtilisateurFromEmail) =>
  async ({ identifier, url }) => {
    const utilisateur = await getUtilisateurFromEmail(identifier);

    await Option.match(utilisateur)
      .some(async (utilisateur) => {
        if (utilisateur.role.nom === 'porteur-projet') {
          await sendEmail({
            templateId: 6785365,
            messageSubject: 'Connexion à Potentiel',
            recipients: [{ email: identifier, fullName: '' }],
            variables: {
              url,
            },
          });
        }
        if (utilisateur.role.nom === 'admin') {
          await sendEmail({
            templateId: 999999,
            messageSubject: 'Potentiel - Connexion avec ProConnect obligatoire',
            recipients: [{ email: identifier, fullName: '' }],
            variables: {
              url,
            },
          });
        }
      })
      .none();
  };
