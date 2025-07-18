import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { délaiRebuilTriggeredProjector } from './délaiRebuildTrigerred.projector';
import { délaiDemandéProjector } from './délaiDemandé.projector';
import { demandeDélaiAnnuléeProjector } from './demandeDélaiAnnulée.projector';
import { demandeDélaiRejetéeProjector } from './demandeDélaiRejetée.projector';
import { demandeDélaiPasséeEnInstructionProjector } from './demandeDélaiPasséeEnInstruction.projector';
import { délaiAccordéProjector } from './délaiAccordée.projector';
import { demandeDélaiCorrigéeProjector } from './demandeDélaiCorrigée.projector';

export type SubscriptionEvent = (Lauréat.Délai.DélaiEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Délai', SubscriptionEvent>;

export const registerDélaiProjectors = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, délaiRebuilTriggeredProjector)
      .with({ type: 'DélaiDemandé-V1' }, délaiDemandéProjector)
      .with(
        {
          type: 'DemandeDélaiPasséeEnInstruction-V1',
        },
        demandeDélaiPasséeEnInstructionProjector,
      )
      .with({ type: 'DemandeDélaiAnnulée-V1' }, demandeDélaiAnnuléeProjector)
      .with({ type: 'DemandeDélaiRejetée-V1' }, demandeDélaiRejetéeProjector)
      .with({ type: 'DélaiAccordé-V1' }, délaiAccordéProjector)
      .with({ type: 'DemandeDélaiCorrigée-V1' }, demandeDélaiCorrigéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Délai', handler);
};
