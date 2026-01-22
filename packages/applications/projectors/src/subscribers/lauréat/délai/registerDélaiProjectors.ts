import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { délaiRebuildTriggeredProjector } from './délaiRebuildTrigerred.projector.js';
import { délaiDemandéProjector } from './délaiDemandé.projector.js';
import { demandeDélaiAnnuléeProjector } from './demandeDélaiAnnulée.projector.js';
import { demandeDélaiRejetéeProjector } from './demandeDélaiRejetée.projector.js';
import { demandeDélaiPasséeEnInstructionProjector } from './demandeDélaiPasséeEnInstruction.projector.js';
import { délaiAccordéProjector } from './délaiAccordée.projector.js';
import { demandeDélaiCorrigéeProjector } from './demandeDélaiCorrigée.projector.js';
import { demandeDélaiSuppriméeProjector } from './demandeDélaiSuppriméeProjector.js';

export type SubscriptionEvent = Lauréat.Délai.DélaiEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Délai', SubscriptionEvent>;

export const registerDélaiProjectors = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, délaiRebuildTriggeredProjector)
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
