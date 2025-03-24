import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Éliminé } from '@potentiel-domain/elimine';

import { éliminéRebuildTriggeredProjector } from './éliminéRebuildTriggered.projector';
import { éliminéNotifiéProjector } from './éliminéNotifié.projector';
import { éliminéArchivéProjector } from './éliminéArchivé.projector';

export type SubscriptionEvent = (Éliminé.ÉliminéEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Eliminé', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) => {
    return match(event)
      .with({ type: 'RebuildTriggered' }, éliminéRebuildTriggeredProjector)
      .with({ type: 'ÉliminéNotifié-V1' }, éliminéNotifiéProjector)
      .with({ type: 'ÉliminéArchivé-V1' }, éliminéArchivéProjector)
      .exhaustive();
  };

  mediator.register('System.Projector.Eliminé', handler);
};
