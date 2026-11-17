import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import {
  handleDemandeDélaiAccordée,
  handleDemandeDélaiAnnulée,
  handleDemandeDélaiCorrigée,
  handleDemandeDélaiPasséeEnInstruction,
  handleDemandeDélaiRejetée,
  handleDélaiDemandé,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Délai.DélaiEvent;

export type Execute = Message<'System.Notification.Lauréat.Délai', SubscriptionEvent>;

export const registerDélaiNotifications = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'DélaiDemandé-V2' }, handleDélaiDemandé)
      .with({ type: 'DemandeDélaiAnnulée-V2' }, handleDemandeDélaiAnnulée)
      .with({ type: 'DemandeDélaiRejetée-V2' }, handleDemandeDélaiRejetée)
      .with({ type: 'DemandeDélaiCorrigée-V2' }, handleDemandeDélaiCorrigée)
      .with({ type: 'DemandeDélaiPasséeEnInstruction-V2' }, handleDemandeDélaiPasséeEnInstruction)
      .with({ type: 'DélaiAccordé-V2' }, handleDemandeDélaiAccordée)
      .with(
        {
          type: P.union(
            'DemandeDélaiSupprimée-V1',
            'DemandeDélaiSupprimée-V2',
            'DélaiDemandé-V1',
            'DemandeDélaiAnnulée-V1',
            'DemandeDélaiCorrigée-V1',
            'DemandeDélaiPasséeEnInstruction-V1',
            'DemandeDélaiRejetée-V1',
            'DélaiAccordé-V1',
            'DélaiDemandé-V1',
          ),
        },
        () => Promise.resolve(),
      )
      .exhaustive();

  mediator.register('System.Notification.Lauréat.Délai', handler);
};
