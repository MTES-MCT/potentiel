import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Message, MessageHandler, mediator } from 'mediateur';
import { removeProjection } from '../infrastructure/removeProjection';
import { upsertProjection } from '../infrastructure/upsertProjection';

export type SubscriptionEvent =
  | (GestionnaireRéseau.GestionnaireRéseauEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Réseau.Gestionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<GestionnaireRéseau.GestionnaireRéseauEntity>(
        `gestionnaire-réseau|${payload.id}`,
      );
    } else {
      switch (type) {
        case 'GestionnaireRéseauAjouté-V1':
        case 'GestionnaireRéseauModifié-V1':
          await upsertProjection<GestionnaireRéseau.GestionnaireRéseauEntity>(
            `gestionnaire-réseau|${payload.codeEIC}`,
            {
              ...payload,
            },
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Réseau.Gestionnaire', handler);
};
