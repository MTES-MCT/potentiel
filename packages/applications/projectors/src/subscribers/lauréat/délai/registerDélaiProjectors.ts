import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { délaiRebuilTriggeredProjector } from './délaiRebuildTrigerred.projector';
import { délaiDemandéProjector } from './délaiDemandé.projector';

export type SubscriptionEvent = (Lauréat.Délai.DélaiEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Délai', SubscriptionEvent>;

export const registerDélaiProjectors = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, délaiRebuilTriggeredProjector)
      .with({ type: 'DélaiDemandé-V1' }, délaiDemandéProjector)
      .with({ type: 'DélaiAccordé-V1' }, async () => {})
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Délai', handler);
};
