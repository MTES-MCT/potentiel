import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { tâcheAjoutéeProjector } from './tâcheAjoutée.projector.js';
import { tâcheRenouvelléeProjector } from './tâcheRenouvellée.projector.js';
import { tâcheRelancéeProjector } from './tâcheRelancée.projector.js';
import { tâcheAchevéeProjector } from './tâcheAchevée.projector.js';
import { tâcheRebuildTriggered } from './tâcheRebuildTriggered.projector.js';

export type SubscriptionEvent = Lauréat.Tâche.TâcheEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Tâche', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, tâcheRebuildTriggered)
      .with({ type: 'TâcheAjoutée-V1' }, tâcheAjoutéeProjector)
      .with({ type: 'TâcheRenouvellée-V1' }, tâcheRenouvelléeProjector)
      .with({ type: 'TâcheRelancée-V1' }, tâcheRelancéeProjector)
      .with({ type: 'TâcheAchevée-V1' }, tâcheAchevéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Tâche', handler);
};
