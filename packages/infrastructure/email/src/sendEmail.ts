import { getLogger } from '@potentiel-libraries/monitoring';

import { mapToSendEmailMode } from './sendEmailMode';
import { getMailjetClient } from './getMailjetClient';

type Recipient = {
  email: string;
  fullName?: string;
};

type SendEmail = (email: {
  templateId: number;
  messageSubject: string;
  recipients: Array<Recipient>;
  cc?: Array<Recipient>;
  bcc?: Array<Recipient>;
  variables: Record<string, string>;
}) => Promise<void>;

const formatRecipients = (recipients: Array<Recipient>) =>
  recipients.map(({ email, fullName }) => ({
    Email: email,
    Name: fullName,
  }));

// Mailjet has a limit of 50 recipients per email: https://dev.mailjet.com/email/guides/send-api-V3/#send-in-bulk
// To be safe, we use a limit of 30 recipients per email.
const MAX_RECIPIENTS = 30;

export const sendEmail: SendEmail = async (sendEmailArgs) => {
  const {
    SEND_EMAILS_FROM,
    SEND_EMAILS_FROM_NAME,
    SEND_EMAIL_MODE = 'logging-only',
    MAINTENANCE_MODE,
  } = process.env;

  const logger = getLogger('sendEmail');

  const mode = mapToSendEmailMode(SEND_EMAIL_MODE);

  if (mode !== 'logging-only' && !MAINTENANCE_MODE) {
    if (!SEND_EMAILS_FROM) {
      throw new Error('SEND_EMAILS_FROM must be set to send emails');
    }
    const {
      templateId,
      messageSubject,
      recipients: allTo,
      cc: allCc = [],
      bcc: allBcc = [],
      variables,
    } = sendEmailArgs;

    if (allTo.length === 0 && allCc.length === 0 && allBcc.length === 0) {
      logger.error('No recipients provided for email', sendEmailArgs);
      return;
    }

    while (allTo.length > 0 || allCc.length > 0 || allBcc.length > 0) {
      const to = allTo.splice(0, MAX_RECIPIENTS);
      const cc = allCc.splice(0, MAX_RECIPIENTS);
      const bcc = allBcc.splice(0, MAX_RECIPIENTS);
      await getMailjetClient()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: SEND_EMAILS_FROM,
                Name: SEND_EMAILS_FROM_NAME,
              },
              To: formatRecipients(to),
              Cc: formatRecipients(cc),
              Bcc: formatRecipients(bcc),
              TemplateID: templateId,
              TemplateLanguage: true,
              Subject: messageSubject,
              Variables: variables,
            },
          ],
          SandboxMode: mode === 'sandbox',
        });
    }

    logger.info('Email sent', sendEmailArgs);
  } else {
    logger.info(
      '📨 Emailing mode set to logging-only so no email was sent, but here are the args: ',
      sendEmailArgs,
    );
  }
};
