import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Producteur } from '@potentiel-domain/laureat';

import { producteurImportéeProjector } from './producteurImporté.projector';
import { producteurRebuilTriggeredProjector } from './producteurRebuildTrigerred.projector';

export type SubscriptionEvent = (Producteur.ProducteurEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Producteur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, producteurRebuilTriggeredProjector)
      .with({ type: 'ProducteurImporté-V1' }, producteurImportéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Producteur', handler);
};
