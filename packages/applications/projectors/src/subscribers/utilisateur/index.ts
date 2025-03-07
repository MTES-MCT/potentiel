import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { UtilisateurEvent } from '@potentiel-domain/utilisateur';

import { utilisateurRebuildTriggered } from './utilisateurRebuildTriggered.projector';
import { accèsAuProjetAutoriséProjector } from './accèsAuProjetAutorisé.projector';
import { utilisateurInvitéProjector } from './utilisateurInvité.projector';

export type SubscriptionEvent = (UtilisateurEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Utilisateur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, utilisateurRebuildTriggered)
      .with({ type: 'UtilisateurInvité-V1' }, utilisateurInvitéProjector)
      .with({ type: 'AccèsAuProjetAutorisé-V1' }, accèsAuProjetAutoriséProjector)
      .exhaustive();

  mediator.register('System.Projector.Utilisateur', handler);
};
