import { NotificationHandlerProps } from '@/helpers';

import { DomainEvent } from '@potentiel-domain/core';

export type ActionnaireNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T> & {
  projet: { nom: string; région: string; département: string; url: string };
  baseUrl?: string;
};
