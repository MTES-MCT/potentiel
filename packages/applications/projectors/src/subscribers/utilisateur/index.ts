import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { UtilisateurEvent } from '@potentiel-domain/utilisateur';
import type { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { porteurInvitéProjector } from './porteurInvité.projector';
import { utilisateurDésactivéProjector } from './utilisateurDésactivé.projector';
import { utilisateurInvitéProjector } from './utilisateurInvité.projector';
import { utilisateurRebuildTriggered } from './utilisateurRebuildTriggered.projector';
import { utilisateurRéactivéProjector } from './utilisateurRéactivé.projector';

export type SubscriptionEvent = (UtilisateurEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Utilisateur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, utilisateurRebuildTriggered)
      .with({ type: 'UtilisateurInvité-V1' }, utilisateurInvitéProjector)
      .with({ type: 'PorteurInvité-V1' }, porteurInvitéProjector)
      .with({ type: 'UtilisateurDésactivé-V1' }, utilisateurDésactivéProjector)
      .with({ type: 'UtilisateurRéactivé-V1' }, utilisateurRéactivéProjector)
      // Deprecated events
      .with({ type: 'AccèsProjetRetiré-V1' }, async () => {})
      .with({ type: 'ProjetRéclamé-V1' }, async () => {})
      .exhaustive();

  mediator.register('System.Projector.Utilisateur', handler);
};
