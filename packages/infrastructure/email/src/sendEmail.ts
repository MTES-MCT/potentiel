import { getLogger } from '@potentiel-libraries/monitoring';

import { getMailjetClient } from './getMailjetClient';
import { mapToSendEmailMode } from './sendEmailMode';

type Receipt = {
  email: string;
  fullName: string;
};

type SendEmail = (email: {
  templateId: number;
  messageSubject: string;
  recipients: Array<Receipt>;
  copyRecipients: Array<Receipt>;
  hiddenCopyRecipients: Array<Receipt>;
  variables: Record<string, string>;
}) => Promise<void>;

const formatRecipients = (recipients: Array<Receipt>) =>
  recipients.map(({ email, fullName }) => ({
    Email: email,
    Name: fullName,
  }));

export const sendEmail: SendEmail = async (sendEmailArgs) => {
  const { SEND_EMAILS_FROM, SEND_EMAILS_FROM_NAME, SEND_EMAIL_MODE = 'logging-only' } = process.env;

  const mode = mapToSendEmailMode(SEND_EMAIL_MODE);

  if (mode !== 'logging-only') {
    const {
      templateId,
      messageSubject,
      recipients,
      copyRecipients,
      hiddenCopyRecipients,
      variables,
    } = sendEmailArgs;

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
            Cc: formatRecipients(copyRecipients),
            Bcc: formatRecipients(hiddenCopyRecipients),
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
    getLogger().info('📨 Emailing mode set to logging-only so no email was sent', sendEmailArgs);
  }
};
