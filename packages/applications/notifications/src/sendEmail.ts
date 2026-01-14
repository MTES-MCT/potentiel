import { mediator } from 'mediateur';

import { TemplateDefinitions } from './templates/emails/index.js';
import { EnvoyerNotificationCommand } from './envoyerNotification.command.js';

export type Recipient = {
  email: string;
  fullName?: string;
};

export type EmailPayload = {
  templateId: number;
  messageSubject: string;
  recipients: Array<Recipient>;
  cc?: Array<Recipient>;
  bcc?: Array<Recipient>;
  variables: Record<string, string>;
};
export type SendEmail = (email: EmailPayload) => Promise<void>;

export type EmailPayloadV2 = TemplateDefinitions & {
  recipients: (string | Recipient)[];
};
export type SendEmailV2 = (email: EmailPayloadV2) => Promise<void>;

export const sendEmail: SendEmailV2 = (data) =>
  mediator.send<EnvoyerNotificationCommand>({
    type: 'System.Notification.Envoyer',
    data,
  });
