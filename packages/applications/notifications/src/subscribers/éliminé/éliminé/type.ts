import { DomainEvent } from '@potentiel-domain/core';

import { NotificationHandlerProps } from '#helpers';

export type ÉliminéNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T> & {};
