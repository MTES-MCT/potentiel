import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { dispositifDeStockageImportéProjector } from './dispositifDeStockageImportée.projector';
import { dispositifDeStockageModifiéProjector } from './dispositifDeStockageModifiée.projector';
import { dispositifDeStockageRebuilTriggeredProjector } from './dispositifDeStockageRebuildTrigerred.projector';

export type SubscriptionEvent = (
  | Lauréat.DispositifDeStockage.DispositifDeStockageEvent
  | RebuildTriggered
) &
  Event;

export type Execute = Message<'System.Projector.Lauréat.DispositifDeStockage', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, dispositifDeStockageRebuilTriggeredProjector)
      .with({ type: 'DispositifDeStockageImporté-V1' }, dispositifDeStockageImportéProjector)
      .with({ type: 'DispositifDeStockageModifié-V1' }, dispositifDeStockageModifiéProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.DispositifDeStockage', handler);
};
