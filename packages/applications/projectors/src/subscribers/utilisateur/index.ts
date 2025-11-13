import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { UtilisateurEvent } from '@potentiel-domain/utilisateur';

import { utilisateurRebuildTriggered } from './utilisateurRebuildTriggered.projector';
import { porteurInvitéProjector } from './porteurInvité.projector';
import { utilisateurInvitéProjector } from './utilisateurInvité.projector';
import { utilisateurDésactivéProjector } from './utilisateurDésactivé.projector';
import { utilisateurRéactivéProjector } from './utilisateurRéactivé.projector';
import { utilisateurInvitéV1Projector } from './utilisateurInvitéV1.projector';
import { rôleUtilisateurModifiéProjector } from './rôleUtilisateurModifié.projector';

export type SubscriptionEvent = UtilisateurEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Utilisateur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, utilisateurRebuildTriggered)
      .with({ type: 'UtilisateurInvité-V1' }, utilisateurInvitéV1Projector)
      .with({ type: 'UtilisateurInvité-V2' }, utilisateurInvitéProjector)
      .with({ type: 'PorteurInvité-V1' }, porteurInvitéProjector)
      .with({ type: 'UtilisateurDésactivé-V1' }, utilisateurDésactivéProjector)
      .with({ type: 'UtilisateurRéactivé-V1' }, utilisateurRéactivéProjector)
      .with({ type: 'RôleUtilisateurModifié-V1' }, rôleUtilisateurModifiéProjector)
      // Deprecated events
      .with({ type: 'AccèsProjetRetiré-V1' }, async () => {})
      .with({ type: 'ProjetRéclamé-V1' }, async () => {})
      .exhaustive();

  mediator.register('System.Projector.Utilisateur', handler);
};
