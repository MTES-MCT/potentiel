import { DomainEvent } from '@potentiel-domain/core';

import { NotificationHandlerPropsV2 } from '#helpers';

export type FournisseurNotificationsProps<T extends DomainEvent> = NotificationHandlerPropsV2<T> & {
  projet: { nom: string; région: string; département: string; url: string };
};
