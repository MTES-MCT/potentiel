import { DomainEvent } from '@potentiel-domain/core';

import { NotificationHandlerProps } from '../../../_helpers';

export type GarantiesFinancièresNotificationsProps<T extends DomainEvent> =
  NotificationHandlerProps<T> & {
    projet: { nom: string; région: string; département: string; url: string };
    baseUrl?: string;
  };
