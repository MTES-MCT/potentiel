import { DomainEvent } from '@potentiel-domain/core';

import { NotificationHandlerProps } from '../../../_helpers';

export type RecoursNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T> & {
  projet: { nom: string; région: string; département: string; url: string };
};
