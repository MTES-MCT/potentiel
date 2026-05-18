import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Accès } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { accèsProjetAutoriséProjector } from './accèsProjetAutorisé.projector.js';
import { accèsProjetRemplacéProjector } from './accèsProjetRemplacé.projector.js';
import { accèsProjetRetiréProjector } from './accèsProjetRetiré.projector.js';
import { accèsRebuildTriggeredProjector } from './accèsRebuildTriggered.projector.js';

export type SubscriptionEvent = Accès.AccèsEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Accès', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, accèsRebuildTriggeredProjector)
      .with({ type: 'AccèsProjetAutorisé-V1' }, accèsProjetAutoriséProjector)
      .with({ type: 'AccèsProjetRetiré-V1' }, accèsProjetRetiréProjector)
      .with({ type: 'AccèsProjetRemplacé-V1' }, accèsProjetRemplacéProjector)
      .exhaustive();

  mediator.register('System.Projector.Accès', handler);
};
