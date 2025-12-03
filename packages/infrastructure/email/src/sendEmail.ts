import { getLogger } from '@potentiel-libraries/monitoring';

import { mapToSendEmailMode } from './sendEmailMode';
import { getMailjetClient } from './getMailjetClient';
import { MailjetContact, MailjetEmail, prepareMessages } from './prepareMessages';

type Recipient = {
  email: string;
  fullName?: string;
};

type SendEmailArgs = {
  templateId: number;
  messageSubject: string;
  recipients: Array<Recipient>;
  cc?: Array<Recipient>;
  bcc?: Array<Recipient>;
  variables: Record<string, string>;
};

type SendEmail = (email: SendEmailArgs) => Promise<void>;

const formatRecipients = (recipients: Array<Recipient>): Array<MailjetContact> | undefined =>
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

  if (!SEND_EMAILS_FROM) {
    throw new Error('SEND_EMAILS_FROM must be set to send emails');
  }

  const logger = getLogger('sendEmail');

  const mode = mapToSendEmailMode(SEND_EMAIL_MODE);

  const {
    templateId,
    messageSubject,
    recipients: to,
    cc = [],
    bcc = [],
    variables,
  } = sendEmailArgs;

  if (to.length + cc.length + bcc.length === 0) {
    logger.error('No recipients provided for email', sendEmailArgs);
    return;
  }

  const message: MailjetEmail = {
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
  };

  const messages = prepareMessages(message, MAX_RECIPIENTS);

  if (mode !== 'logging-only' && !MAINTENANCE_MODE) {
    for (const message of messages) {
      await getMailjetClient()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [message],
          SandboxMode: mode === 'sandbox',
        })
        .catch((error) => {
          console.log(message);
          console.log(Object.keys(error));
          console.log(error.config.data);
          console.log(error.response.data.Messages[0].Errors);
          throw error;
        });
    }

    logger.info('Email sent', { messages });
  } else {
    logger.info(
      '📨 Emailing mode set to logging-only so no email was sent, but here are the args: ',
      { messages },
    );
  }
};
