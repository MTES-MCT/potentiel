import { NotificationHandlerProps } from '@/helpers';

import { DomainEvent } from '@potentiel-domain/core';

export type AccèsNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T> & {
  candidature: { nom: string; région: string; département: string };
};
