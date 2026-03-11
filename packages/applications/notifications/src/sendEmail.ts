import { mediator } from 'mediateur';

import { TemplateDefinitions } from './templates/emails/index.js';
import { EnvoyerNotificationCommand } from './envoyerNotification.command.js';

export type Recipient = string;

export type EmailPayload = TemplateDefinitions & {
  /**
   * List of recipients' email addresses
   */
  recipients: Recipient[];
};
export type SendEmail = (email: EmailPayload) => Promise<void>;

export const sendEmail: SendEmail = (data) =>
  mediator.send<EnvoyerNotificationCommand>({
    type: 'System.Notification.Envoyer',
    data,
  });
