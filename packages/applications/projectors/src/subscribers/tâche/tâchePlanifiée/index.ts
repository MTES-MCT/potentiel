import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâchePlanifiéeEvent } from '@potentiel-domain/tache-planifiee';
import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { tâchePlanifiéeRebuilTriggered } from './tâchePlanifiéeRebuildTriggered';
import { tâchePlanifiéeAjoutéeProjector } from './tâchePlanifiéeAjoutée.projector';
import { tâchePlanifiéeExecutéeProjector } from './tâchePlanifiéeExecutée.projector';
import { tâchePlanifiéeAnnuléeProjector } from './tâchePlanifiéeAnnulée.projector';

export type SubscriptionEvent = (TâchePlanifiéeEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.TâchePlanifiée', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) => {
    return match(event)
      .with({ type: 'RebuildTriggered' }, tâchePlanifiéeRebuilTriggered)
      .with({ type: 'TâchePlanifiéeAjoutée-V1' }, tâchePlanifiéeAjoutéeProjector)
      .with({ type: 'TâchePlanifiéeAnnulée-V1' }, tâchePlanifiéeAnnuléeProjector)
      .with({ type: 'TâchePlanifiéeExecutée-V1' }, tâchePlanifiéeExecutéeProjector)
      .exhaustive();
  };

  mediator.register('System.Projector.TâchePlanifiée', handler);
};
