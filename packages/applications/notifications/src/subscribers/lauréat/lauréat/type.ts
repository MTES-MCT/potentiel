import { DomainEvent } from '@potentiel-domain/core';

import { NotificationHandlerProps } from '../../../_helpers';

export type LauréatNotificationsProps<T extends DomainEvent> = NotificationHandlerProps<T>;
