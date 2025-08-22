import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { tâchePlanifiéeAjoutéeProjector } from './tâchePlanifiéeAjoutée.projector';
import { tâchePlanifiéeAnnuléeProjector } from './tâchePlanifiéeAnnulée.projector';
import { tâchePlanifiéeExecutéeProjector } from './tâchePlanifiéeExecutée.projector';
import { tâchePlanifiéeRebuilTriggered } from './tâchePlanifiéeRebuildTriggered';

export type SubscriptionEvent =
  | (Lauréat.TâchePlanifiée.TâchePlanifiéeEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.TâchePlanifiée', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, tâchePlanifiéeRebuilTriggered)
      .with({ type: 'TâchePlanifiéeAjoutée-V1' }, tâchePlanifiéeAjoutéeProjector)
      .with({ type: 'TâchePlanifiéeAnnulée-V1' }, tâchePlanifiéeAnnuléeProjector)
      .with({ type: 'TâchePlanifiéeExecutée-V1' }, tâchePlanifiéeExecutéeProjector)
      .exhaustive();

  mediator.register('System.Projector.TâchePlanifiée', handler);
};
