import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { demandeDélaiAnnuléeProjector } from './demandeDélaiAnnulée.projector';
import { demandeDélaiCorrigéeProjector } from './demandeDélaiCorrigée.projector';
import { demandeDélaiPasséeEnInstructionProjector } from './demandeDélaiPasséeEnInstruction.projector';
import { demandeDélaiRejetéeProjector } from './demandeDélaiRejetée.projector';
import { demandeDélaiSuppriméeProjector } from './demandeDélaiSuppriméeProjector';
import { délaiAccordéProjector } from './délaiAccordée.projector';
import { délaiDemandéProjector } from './délaiDemandé.projector';
import { délaiRebuilTriggeredProjector } from './délaiRebuildTrigerred.projector';

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
      .with({ type: 'DemandeDélaiSupprimée-V1' }, demandeDélaiSuppriméeProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Délai', handler);
};
