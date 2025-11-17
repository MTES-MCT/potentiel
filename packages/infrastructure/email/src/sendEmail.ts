import { getLogger } from '@potentiel-libraries/monitoring';

import { getMailjetClient } from './getMailjetClient';
import { mapToSendEmailMode } from './sendEmailMode';

type Receipt = {
  email: string;
  fullName?: string;
};

type SendEmail = (email: {
  templateId: number;
  messageSubject: string;
  recipients: Array<Receipt>;
  cc?: Array<Receipt>;
  bcc?: Array<Receipt>;
  variables: Record<string, string>;
}) => Promise<void>;

const formatRecipients = (recipients: Array<Receipt>) =>
  recipients.map(({ email, fullName }) => ({
    Email: email,
    Name: fullName,
  }));

export const sendEmail: SendEmail = async (sendEmailArgs) => {
  const {
    SEND_EMAILS_FROM,
    SEND_EMAILS_FROM_NAME,
    SEND_EMAIL_MODE = 'logging-only',
    MAINTENANCE_MODE,
  } = process.env;

  const mode = mapToSendEmailMode(SEND_EMAIL_MODE);

  if (mode !== 'logging-only' && !MAINTENANCE_MODE) {
    const { templateId, messageSubject, recipients, cc, bcc, variables } = sendEmailArgs;

    if (recipients.length === 0 && !cc?.length && !bcc?.length) {
      getLogger().error('No recipients provided for email', sendEmailArgs);
      return;
    }

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
            To: formatRecipients(recipients),
            ...(cc && { Cc: formatRecipients(cc) }),
            ...(bcc && { Bcc: formatRecipients(bcc) }),
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
    getLogger().info(
      '📨 Emailing mode set to logging-only so no email was sent, but here are the args: ',
      sendEmailArgs,
    );
  }
};
