import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

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
      .with({ type: 'DélaiDemandé-V1' }, handleDélaiDemandé)
      .with({ type: 'DemandeDélaiAnnulée-V1' }, handleDemandeDélaiAnnulée)
      .with({ type: 'DemandeDélaiRejetée-V1' }, handleDemandeDélaiRejetée)
      .with({ type: 'DemandeDélaiCorrigée-V1' }, handleDemandeDélaiCorrigée)
      .with({ type: 'DemandeDélaiPasséeEnInstruction-V1' }, handleDemandeDélaiPasséeEnInstruction)
      .with({ type: 'DélaiAccordé-V1' }, handleDemandeDélaiAccordée)
      .with({ type: 'DemandeDélaiSupprimée-V1' }, () => Promise.resolve())
      .exhaustive();

  mediator.register('System.Notification.Lauréat.Délai', handler);
};
