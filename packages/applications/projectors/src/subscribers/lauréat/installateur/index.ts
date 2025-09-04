import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { installateurImportéProjector } from './installateurImporté.projector';
import { installateurRebuilTriggeredProjector } from './installateurRebuildTrigerred.projector';

export type SubscriptionEvent = (Lauréat.Installateur.InstallateurEvent | RebuildTriggered) & Event;

export type Execute = Message<'System.Projector.Lauréat.Installateur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, installateurRebuilTriggeredProjector)
      .with({ type: 'InstallateurImporté-V1' }, installateurImportéProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Installateur', handler);
};
