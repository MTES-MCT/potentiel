import { getLogger } from '@potentiel-libraries/monitoring';

import { getMailjetClient } from './getMailjetClient';
import { mapToSendEmailMode } from './sendEmailMode';

type EmailPayload = {
  templateId: number;
  messageSubject: string;
  recipients: { email: string; fullName: string }[];
  variables: Record<string, string>;
};
type SendEmail = (email: EmailPayload) => Promise<void>;

export const sendEmail: SendEmail = async (sendEmailArgs) => {
  const { templateId, messageSubject, recipients, variables } = sendEmailArgs;

  const { SEND_EMAILS_FROM, SEND_EMAILS_FROM_NAME, SEND_EMAIL_MODE = 'logging-only' } = process.env;

  const mode = mapToSendEmailMode(SEND_EMAIL_MODE);

  if (mode !== 'logging-only') {
    await getMailjetClient()
      .post('send', {
        version: 'v3.1',
      })
      .request({
        Messages: [
          {
            From: {
              Email: SEND_EMAILS_FROM,
              Name: SEND_EMAILS_FROM_NAME,
            },
            To: recipients.map(({ email, fullName }) => ({
              Email: email,
              Name: fullName,
            })),
            TemplateID: templateId,
            TemplateLanguage: true,
            Subject: messageSubject,
            Variables: variables,
          },
        ],
        SandboxMode: mode === 'sandbox' ? true : false,
      });

    getLogger().info('Email sent', sendEmailArgs);
  } else {
    getLogger().info('Emailing mode set to logging-only so no email was sent', sendEmailArgs);
  }
};
