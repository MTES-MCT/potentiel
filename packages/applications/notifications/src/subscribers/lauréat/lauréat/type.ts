import { NotificationHandlerProps } from '@/helpers';

import { DomainEvent } from '@potentiel-domain/core';

export type LauréatNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T>;
