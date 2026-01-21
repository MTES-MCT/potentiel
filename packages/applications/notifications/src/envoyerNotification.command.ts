import { Message, MessageHandler, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';

import { EmailPayloadV2 } from '#sendEmail';

import { render } from './templates/render.js';

export type EnvoyerNotificationCommand = Message<'System.Notification.Envoyer', EmailPayloadV2>;

export type SendEmailPort = (options: {
  recipients: string[];
  subject: string;
  content: string;
}) => Promise<void>;

export type RegisterEnvoyerNotificationCommandDependencies = {
  sendEmail: SendEmailPort;
};

export const registerEnvoyerNotificationCommand = ({
  sendEmail,
}: RegisterEnvoyerNotificationCommandDependencies) => {
  const handler: MessageHandler<EnvoyerNotificationCommand> = async (props) => {
    const { recipients } = props;
    const logger = getLogger('System.Notification.Envoyer');

    if (recipients.length === 0) {
      logger.warn('No recipients provided, skipping email sending', props);
      return;
    }

    const { html, subject } = render(props);

    await sendEmail({
      content: html,
      subject: subject ?? '',
      recipients: recipients.map((recipient) =>
        typeof recipient === 'string' ? recipient : recipient.email,
      ),
    });
  };
  mediator.register('System.Notification.Envoyer', handler);
};
