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
      .with({ type: P.union('DélaiDemandé-V1', 'DélaiDemandé-V2') }, handleDélaiDemandé)
      .with(
        { type: P.union('DemandeDélaiAnnulée-V1', 'DemandeDélaiAnnulée-V2') },
        handleDemandeDélaiAnnulée,
      )
      .with(
        { type: P.union('DemandeDélaiRejetée-V1', 'DemandeDélaiRejetée-V2') },
        handleDemandeDélaiRejetée,
      )
      .with(
        { type: P.union('DemandeDélaiCorrigée-V1', 'DemandeDélaiCorrigée-V2') },
        handleDemandeDélaiCorrigée,
      )
      .with(
        {
          type: P.union('DemandeDélaiPasséeEnInstruction-V1', 'DemandeDélaiPasséeEnInstruction-V2'),
        },
        handleDemandeDélaiPasséeEnInstruction,
      )
      .with({ type: P.union('DélaiAccordé-V1', 'DélaiAccordé-V2') }, handleDemandeDélaiAccordée)
      .with({ type: P.union('DemandeDélaiSupprimée-V1', 'DemandeDélaiSupprimée-V2') }, () =>
        Promise.resolve(),
      )
      .exhaustive();

  mediator.register('System.Notification.Lauréat.Délai', handler);
};
