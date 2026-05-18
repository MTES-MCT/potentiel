import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { tâchePlanifiéeAjoutéeProjector } from './tâchePlanifiéeAjoutée.projector.js';
import { tâchePlanifiéeAnnuléeProjector } from './tâchePlanifiéeAnnulée.projector.js';
import { tâchePlanifiéeExecutéeProjector } from './tâchePlanifiéeExecutée.projector.js';
import { tâchePlanifiéeRebuildTriggered } from './tâchePlanifiéeRebuildTriggered.js';

export type SubscriptionEvent = Lauréat.TâchePlanifiée.TâchePlanifiéeEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.TâchePlanifiée', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, tâchePlanifiéeRebuildTriggered)
      .with({ type: 'TâchePlanifiéeAjoutée-V1' }, tâchePlanifiéeAjoutéeProjector)
      .with({ type: 'TâchePlanifiéeAnnulée-V1' }, tâchePlanifiéeAnnuléeProjector)
      .with({ type: 'TâchePlanifiéeExecutée-V1' }, tâchePlanifiéeExecutéeProjector)
      .exhaustive();

  mediator.register('System.Projector.TâchePlanifiée', handler);
};
