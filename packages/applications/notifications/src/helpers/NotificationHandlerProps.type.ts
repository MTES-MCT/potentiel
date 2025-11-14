import { DomainEvent } from '@potentiel-domain/core';

import { SendEmail } from '@/sendEmail';

export type NotificationHandlerProps<T extends DomainEvent> = {
  sendEmail: SendEmail;
  event: T;
};
