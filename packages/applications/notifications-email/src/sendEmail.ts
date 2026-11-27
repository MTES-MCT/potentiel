import { mediator } from 'mediateur';

import type { EnvoyerNotificationEmailCommand } from './envoyerNotificationEmail.command.js';
import type { TemplateDefinitions } from './templates/emails/index.js';

export type Recipient = string;

export type EmailPayload = TemplateDefinitions & {
  /**
   * List of recipients' email addresses
   */
  recipients: Recipient[];
};
export type SendEmail = (email: EmailPayload) => Promise<void>;

export const sendEmail: SendEmail = (data) =>
  mediator.send<EnvoyerNotificationEmailCommand>({
    type: 'System.NotificationEmail.Envoyer',
    data,
  });
