import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { tâcheAjoutéeProjector } from './tâcheAjoutée.projector';
import { tâcheRenouvelléeProjector } from './tâcheRenouvellée.projector';
import { tâcheRelancéeProjector } from './tâcheRelancée.projector';
import { tâcheAchevéeProjector } from './tâcheAchevée.projector';
import { tâcheRebuilTriggered } from './tâcheRebuildTriggered.projector';

export type SubscriptionEvent = (Lauréat.Tâche.TâcheEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Tâche', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, tâcheRebuilTriggered)
      .with({ type: 'TâcheAjoutée-V1' }, tâcheAjoutéeProjector)
      .with({ type: 'TâcheRenouvellée-V1' }, tâcheRenouvelléeProjector)
      .with({ type: 'TâcheRelancée-V1' }, tâcheRelancéeProjector)
      .with({ type: 'TâcheAchevée-V1' }, tâcheAchevéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Tâche', handler);
};
