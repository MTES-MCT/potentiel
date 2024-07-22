import { Message, MessageHandler, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';

import { EmailPayload } from './infrastructure/sendEmail';
import { getMailjetClient } from './infrastructure/getMailjetClient';
import { mapToSendEmailMode } from './infrastructure/sendEmailMode';

export type SendEmailCommand = Message<'System.Notification.Email.Send', EmailPayload>;

export function register() {
  const handler: MessageHandler<SendEmailCommand> = async (event) => {
    const { templateId, messageSubject, recipients, variables } = event;

    const {
      SEND_EMAILS_FROM,
      SEND_EMAILS_FROM_NAME,
      SEND_EMAIL_MODE = 'logging-only',
    } = process.env;

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

      getLogger().info('Email sent', event);
    } else {
      getLogger().info('Emailing mode set to logging-only so no email was sent', event);
    }
  };
  mediator.register('System.Notification.Email.Send', handler);
}
