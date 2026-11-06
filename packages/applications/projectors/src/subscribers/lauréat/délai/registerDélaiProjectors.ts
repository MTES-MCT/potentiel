import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { demandeDélaiAnnuléeProjector } from './demandeDélaiAnnulée.projector.js';
import { demandeDélaiCorrigéeProjector } from './demandeDélaiCorrigée.projector.js';
import { demandeDélaiPasséeEnInstructionProjector } from './demandeDélaiPasséeEnInstruction.projector.js';
import { demandeDélaiRejetéeProjector } from './demandeDélaiRejetée.projector.js';
import { demandeDélaiSuppriméeProjector } from './demandeDélaiSuppriméeProjector.js';
import { délaiAccordéProjector } from './délaiAccordée.projector.js';
import { délaiDemandéProjector } from './délaiDemandé.projector.js';
import { délaiRebuildTriggeredProjector } from './délaiRebuildTrigerred.projector.js';

export type SubscriptionEvent = Lauréat.Délai.DélaiEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Délai', SubscriptionEvent>;

export const registerDélaiProjectors = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, délaiRebuildTriggeredProjector)
      .with({ type: P.union('DélaiDemandé-V1', 'DélaiDemandé-V2') }, délaiDemandéProjector)
      .with(
        {
          type: P.union('DemandeDélaiPasséeEnInstruction-V1', 'DemandeDélaiPasséeEnInstruction-V2'),
        },
        demandeDélaiPasséeEnInstructionProjector,
      )
      .with(
        { type: P.union('DemandeDélaiAnnulée-V1', 'DemandeDélaiAnnulée-V2') },
        demandeDélaiAnnuléeProjector,
      )
      .with(
        { type: P.union('DemandeDélaiRejetée-V1', 'DemandeDélaiRejetée-V2') },
        demandeDélaiRejetéeProjector,
      )
      .with({ type: P.union('DélaiAccordé-V1', 'DélaiAccordé-V2') }, délaiAccordéProjector)
      .with(
        { type: P.union('DemandeDélaiCorrigée-V1', 'DemandeDélaiCorrigée-V2') },
        demandeDélaiCorrigéeProjector,
      )
      .with(
        { type: P.union('DemandeDélaiSupprimée-V1', 'DemandeDélaiSupprimée-V2') },
        demandeDélaiSuppriméeProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Délai', handler);
};
