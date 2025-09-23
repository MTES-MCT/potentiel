import { DomainEvent } from '@potentiel-domain/core';

import { SendEmail } from '../../../sendEmail';

export type RecoursNotificationsProps<T extends DomainEvent> = {
  sendEmail: SendEmail;
  event: T;
  projet: { nom: string; région: string; département: string; url: string };
};
