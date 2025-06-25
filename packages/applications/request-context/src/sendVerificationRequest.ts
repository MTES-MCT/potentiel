import { EmailUserConfig } from 'next-auth/providers/email';

import { SendEmail } from '@potentiel-applications/notifications';

type BuildSendVerificationRequest = (
  sendEmail: SendEmail,
) => NonNullable<EmailUserConfig['sendVerificationRequest']>;

export const buildSendVerificationRequest: BuildSendVerificationRequest =
  (sendEmail) =>
  async ({ identifier, url }) => {
    await sendEmail({
      templateId: 6785365,
      messageSubject: 'Connexion à Potentiel',
      recipients: [{ email: identifier, fullName: '' }],
      variables: {
        url,
      },
    });
  };
