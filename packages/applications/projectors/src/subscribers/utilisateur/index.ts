import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { UtilisateurEvent } from '@potentiel-domain/utilisateur';

import { utilisateurRebuildTriggered } from './utilisateurRebuildTriggered.projector';
import { PorteurInvitéProjector } from './porteurInvité.projector';
import { utilisateurInvitéProjector } from './utilisateurInvité.projector';
import { projetRéclaméProjector } from './projetRéclamé.projector';
import { accèsProjetRetiréProjector } from './accèsProjetRetiré.projector';
import { utilisateurSuppriméProjector } from './utilisateurSupprimé.projector';

export type SubscriptionEvent = (UtilisateurEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Utilisateur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, utilisateurRebuildTriggered)
      .with({ type: 'UtilisateurInvité-V1' }, utilisateurInvitéProjector)
      .with({ type: 'PorteurInvité-V1' }, PorteurInvitéProjector)
      .with({ type: 'ProjetRéclamé-V1' }, projetRéclaméProjector)
      .with({ type: 'AccèsProjetRetiré-V1' }, accèsProjetRetiréProjector)
      .with({ type: 'UtilisateurSupprimé-V1' }, utilisateurSuppriméProjector)
      .exhaustive();

  mediator.register('System.Projector.Utilisateur', handler);
};
