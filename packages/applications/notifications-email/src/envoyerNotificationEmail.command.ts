import { type Message, type MessageHandler, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';

import type { EmailPayload } from '#sendEmail';
import { render } from './templates/render.js';

export type EnvoyerNotificationEmailCommand = Message<
  'System.NotificationEmail.Envoyer',
  EmailPayload
>;

export type SendEmailPort = (options: {
  recipients: string[];
  subject: string;
  content: string;
}) => Promise<void>;

export type RegisterEnvoyerNotificationEmailCommandDependencies = {
  sendEmail: SendEmailPort;
};

export const registerEnvoyerNotificationEmailCommand = ({
  sendEmail,
}: RegisterEnvoyerNotificationEmailCommandDependencies) => {
  const handler: MessageHandler<EnvoyerNotificationEmailCommand> = async (props) => {
    const { recipients } = props;
    const logger = getLogger('System.NotificationEmail.Envoyer');

    if (recipients.length === 0) {
      logger.warn('No recipients provided, skipping email sending', props);
      return;
    }

    const { html, subject } = render(props);

    await sendEmail({
      content: html,
      subject: subject ?? '',
      recipients,
    });
  };
  mediator.register('System.NotificationEmail.Envoyer', handler);
};
