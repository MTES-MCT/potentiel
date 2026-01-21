import nodemailer from 'nodemailer';
import {
  circuitBreaker,
  handleAll,
  ConsecutiveBreaker,
  ExponentialBackoff,
  retry,
  wrap,
} from 'cockatiel';

import { getLogger } from '@potentiel-libraries/monitoring';

export type EmailOptions = {
  recipients: string[];
  subject: string;
  content: string;
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  const { SEND_EMAILS_FROM, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SSL } = process.env;

  if (!SEND_EMAILS_FROM) {
    throw new Error('SEND_EMAILS_FROM must be set to send emails');
  }
  if (!SMTP_HOST || !SMTP_PORT) {
    throw new Error('SMTP_HOST and SMTP_PORT must be set to send emails');
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SSL === 'true',
      auth: SMTP_USER
        ? {
            user: SMTP_USER,
            pass: SMTP_PASS,
          }
        : undefined,
      from: SEND_EMAILS_FROM,
    });
  }
  return transporter;
};

// circuit breaker that opens (stops futher calls) after 3 consecutive failures
// and uses exponential backoff to gradually close the circuit again.
const globalCircuitBreaker = circuitBreaker(handleAll, {
  halfOpenAfter: new ExponentialBackoff(),
  breaker: new ConsecutiveBreaker(3),
});

export const sendEmailV2 = async ({ content, subject, recipients }: EmailOptions) => {
  const transporter = getTransporter();
  const logger = getLogger('sendEmailv2');

  // Retry policy with exponential backoff for individual calls
  const retryPolicy = retry(handleAll, {
    maxAttempts: 5,
    backoff: new ExponentialBackoff(),
  });

  // Combined policy
  const emailPolicy = wrap(retryPolicy, globalCircuitBreaker);
  await emailPolicy.execute(async () =>
    transporter.sendMail({
      subject,
      html: content,
      to: recipients.join(';'),
      from: transporter.options.from!,
    }),
  );

  logger.info('Email sent', { recipients, subject });
};
