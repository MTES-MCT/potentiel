import { DomainEvent } from '@potentiel-domain/core';

import { SendEmail, SendEmailV2 } from '#sendEmail';

export type NotificationHandlerProps<T extends DomainEvent> = {
  sendEmail: SendEmail;
  event: T;
};

export type NotificationHandlerPropsV2<T extends DomainEvent> = {
  sendEmail: SendEmailV2;
  event: T;
};
