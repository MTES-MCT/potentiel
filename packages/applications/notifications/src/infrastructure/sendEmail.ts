import { mediator } from 'mediateur';

import { SendEmailCommand } from '../register';

export type EmailPayload = {
  templateId: number;
  messageSubject: string;
  recipients: { email: string; fullName: string }[];
  variables: Record<string, string>;
};
type SendEmail = (email: EmailPayload) => Promise<void>;

export const sendEmail: SendEmail = async (sendEmailArgs) => {
  await mediator.send<SendEmailCommand>({
    type: 'System.Notification.Email.Send',
    data: sendEmailArgs,
  });
};
