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
      .with({ type: 'DemandeDélaiAnnulée-V1' }, handleDemandeDélaiAnnulée)
      .with({ type: 'DemandeDélaiRejetée-V1' }, handleDemandeDélaiRejetée)
      .with(
        { type: P.union('DemandeDélaiCorrigée-V1', 'DemandeDélaiCorrigée-V2') },
        handleDemandeDélaiCorrigée,
      )
      .with({ type: 'DemandeDélaiPasséeEnInstruction-V1' }, handleDemandeDélaiPasséeEnInstruction)
      .with({ type: P.union('DélaiAccordé-V1', 'DélaiAccordé-V2') }, handleDemandeDélaiAccordée)
      .with({ type: 'DemandeDélaiSupprimée-V1' }, () => Promise.resolve())
      .exhaustive();

  mediator.register('System.Notification.Lauréat.Délai', handler);
};
