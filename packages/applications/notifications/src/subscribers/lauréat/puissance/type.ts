import { DomainEvent } from '@potentiel-domain/core';

import { NotificationHandlerProps } from '../../../_helpers';

export type PuissanceNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T> & {
  projet: { nom: string; région: string; département: string; url: string };
  baseUrl?: string;
};
