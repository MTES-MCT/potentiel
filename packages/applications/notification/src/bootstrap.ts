import { mediator } from 'mediateur';
import { subscribe } from '@potentiel/pg-event-sourcing';
import { DépôtGarantiesFinancièresEvent } from '@potentiel/domain';

import {
  ExecuteDépôtGarantiesFinancièresNotification,
  registerDépôtGarantiesFinancièresNotification,
} from './garantiesFinancières/dépôt/dépôtGarantiesFinancières.notification';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (): Promise<UnsetupApp> => {
  registerDépôtGarantiesFinancièresNotification({});

  // Subscribes
  const unsubscribeNotifications = await subscribe<DépôtGarantiesFinancièresEvent>({
    name: 'notifications',
    eventType: ['DépôtGarantiesFinancièresValidé-v1'],
    eventHandler: async (event: DépôtGarantiesFinancièresEvent) => {
      await mediator.publish<ExecuteDépôtGarantiesFinancièresNotification>({
        type: 'EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_NOTIFICATION',
        data: event,
      });
    },
  });

  return unsubscribeNotifications;
};
