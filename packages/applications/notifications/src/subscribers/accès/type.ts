import { DomainEvent } from '@potentiel-domain/core';

import { NotificationHandlerProps } from '#helpers';

export type AccèsNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T> & {
  candidature: { nom: string; région: string; département: string };
};
