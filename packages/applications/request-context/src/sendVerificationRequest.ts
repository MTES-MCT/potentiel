import { EmailUserConfig } from 'next-auth/providers/email';

import { SendEmail } from '@potentiel-applications/notifications';
import { Option } from '@potentiel-libraries/monads';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

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
      .some((utilisateur) => {
        const role = Utilisateur.bind(utilisateur).role;

        if (nePeutPasSeConnecterAvecUnEmail(role)) {
          return sendEmail({
            templateId: 7103248,
            messageSubject: 'Potentiel - Connexion avec ProConnect obligatoire',
            recipients: [{ email: identifier, fullName: '' }],
            variables: {
              url: Routes.Auth.signIn({ proConnect: true }),
            },
          });
        }

        return sendEmail({
          templateId: 6785365,
          messageSubject: 'Connexion à Potentiel',
          recipients: [{ email: identifier, fullName: '' }],
          variables: {
            url,
          },
        });
      })
      .none();
  };

const nePeutPasSeConnecterAvecUnEmail = (role: Role.ValueType) => role.estDGEC() || role.estDreal();
