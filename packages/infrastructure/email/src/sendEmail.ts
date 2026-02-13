import {
  circuitBreaker,
  handleAll,
  ConsecutiveBreaker,
  ExponentialBackoff,
  retry,
  wrap,
} from 'cockatiel';
import { SendEmailV3_1 } from 'node-mailjet';

import { getLogger } from '@potentiel-libraries/monitoring';

import { mapToSendEmailMode } from './sendEmailMode.js';
import { getMailjetClient } from './getMailjetClient.js';

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

const formatRecipients = (recipients: Array<Recipient>): Array<SendEmailV3_1.EmailAddressTo> =>
  recipients.map(({ email, fullName }) => ({
    Email: email,
    Name: fullName,
  }));

// circuit breaker that opens (stops futher calls) after 3 consecutive failures
// and uses exponential backoff to gradually close the circuit again.
const globalCircuitBreaker = circuitBreaker(handleAll, {
  halfOpenAfter: new ExponentialBackoff(),
  breaker: new ConsecutiveBreaker(3),
});

export const sendEmail: SendEmail = async (sendEmailArgs) => {
  const { SEND_EMAILS_FROM, SEND_EMAILS_FROM_NAME, SEND_EMAIL_MODE = 'logging-only' } = process.env;

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

  const totalRecipients = to.length + cc.length + bcc.length;
  if (totalRecipients === 0) {
    logger.error('No recipients provided for email', sendEmailArgs);
    return;
  }

  // Retry policy with exponential backoff for individual calls
  const retryPolicy = retry(handleAll, {
    maxAttempts: 5,
    backoff: new ExponentialBackoff(),
  });

  // Combined policy
  const emailPolicy = wrap(retryPolicy, globalCircuitBreaker);

  await emailPolicy.execute(async () => {
    if (mode !== 'logging-only') {
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
            } satisfies SendEmailV3_1.Message,
          ],
          SandboxMode: mode === 'sandbox',
        });

      logger.info('Email sent', sendEmailArgs);
    } else {
      if (totalRecipients > 50) {
        throw new Error(
          'Sending emails too more than 50 recipients, which would be prevented in non-logging mode',
        );
      }

      logger.info(
        '📨 Emailing mode set to logging-only so no email was sent, but here are the args: ',
        sendEmailArgs,
      );
    }
  });
};
