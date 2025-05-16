import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Accès } from '@potentiel-domain/projet';

import { accèsRebuildTriggeredProjector } from './accèsRebuildTriggered.projector';
import { accèsProjetRetiréProjector } from './accèsProjetRetiréProjector.projector';

export type SubscriptionEvent = (Accès.AccèsEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Utilisateur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, accèsRebuildTriggeredProjector)
      .with({ type: 'AccèsProjetAutorisé-V1' }, () => {})
      .with({ type: 'AccèsProjetRetiré-V1' }, accèsProjetRetiréProjector)
      .exhaustive();

  mediator.register('System.Projector.Utilisateur', handler);
};
