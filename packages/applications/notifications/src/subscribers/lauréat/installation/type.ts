import { NotificationHandlerProps } from '@/helpers';

import { DomainEvent } from '@potentiel-domain/core';

export type InstallationNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T> & {
  projet: { nom: string; région: string; département: string; url: string };
  baseUrl?: string;
};
