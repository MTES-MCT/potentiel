import { DomainEvent } from '@potentiel-domain/core';

import { NotificationHandlerProps } from '@/helpers';

export type AchèvementNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T> & {
  projet: { nom: string; région: string; département: string; url: string };
};
