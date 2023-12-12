import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Message, MessageHandler, mediator } from 'mediateur';
import { removeProjection } from '../utils/removeProjection';
import { upsertProjection } from '../utils/upsertProjection';

export type SubscriptionEvent =
  | (GestionnaireRéseau.GestionnaireRéseauEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<GestionnaireRéseau.GestionnaireRéseauProjection>(
        `gestionnaire-réseau|${payload.id}`,
      );
    } else {
      switch (type) {
        case 'GestionnaireRéseauAjouté-V1':
        case 'GestionnaireRéseauModifié-V1':
          await upsertProjection<GestionnaireRéseau.GestionnaireRéseauProjection>(
            `gestionnaire-réseau|${payload.codeEIC}`,
            {
              ...payload,
            },
          );
          break;
      }
    }
  };

  mediator.register('EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR', handler);
};
