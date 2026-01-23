import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Éliminé } from '@potentiel-domain/projet';

import { éliminéRebuildTriggeredProjector } from './éliminéRebuildTriggered.projector.js';
import { éliminéNotifiéProjector } from './éliminéNotifié.projector.js';
import { éliminéArchivéProjector } from './éliminéArchivé.projector.js';

export type SubscriptionEvent = Éliminé.ÉliminéEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Eliminé', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, éliminéRebuildTriggeredProjector)
      .with({ type: 'ÉliminéNotifié-V1' }, éliminéNotifiéProjector)
      .with({ type: 'ÉliminéArchivé-V1' }, éliminéArchivéProjector)
      .exhaustive();

  mediator.register('System.Projector.Eliminé', handler);
};
