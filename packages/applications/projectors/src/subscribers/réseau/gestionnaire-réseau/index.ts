import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import type { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { gestionnaireRéseauAjoutéProjector } from './gestionnaireRéseauAjouté.projector';
import { gestionnaireRéseauAjoutéV1Projector } from './gestionnaireRéseauAjoutéV1.projector';
import { gestionnaireRéseauRebuildTriggeredProjector } from './gestionnaireRéseauRebuildTriggered.projector';

export type SubscriptionEvent =
  | (GestionnaireRéseau.GestionnaireRéseauEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Réseau.Gestionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, gestionnaireRéseauRebuildTriggeredProjector)
      .with(
        { type: P.union('GestionnaireRéseauAjouté-V1', 'GestionnaireRéseauModifié-V1') },
        gestionnaireRéseauAjoutéV1Projector,
      )
      .with(
        { type: P.union('GestionnaireRéseauAjouté-V2', 'GestionnaireRéseauModifié-V2') },
        gestionnaireRéseauAjoutéProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Réseau.Gestionnaire', handler);
};
