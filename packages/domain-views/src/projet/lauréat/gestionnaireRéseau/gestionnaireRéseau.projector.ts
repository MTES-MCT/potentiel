import { Message, MessageHandler, mediator } from 'mediateur';
import { GestionnaireRéseauProjetEvent } from '@potentiel/domain';
import { Find, RebuildTriggered, Remove, Upsert } from '@potentiel/core-domain-views';
import {
  GestionnaireRéseauLauréatLegacyReadModel,
} from './gestionnaireRéseauLauréat.readmodel';

export type ExecuteGestionnaireRéseauLauréatProjector = Message<
  'EXECUTE_GESTIONNAIRE_RÉSEAU_LAURÉAT_PROJECTOR',
  GestionnaireRéseauProjetEvent | RebuildTriggered
>;

export type GestionnaireRéseauLauréatProjectorDependencies = {
  upsert: Upsert;
  find: Find;
  remove: Remove;
};

export const registerGestionnaireRéseauLauréatProjector = ({
  upsert,
  find,
  remove,
}: GestionnaireRéseauLauréatProjectorDependencies) => {
  const handler: MessageHandler<ExecuteGestionnaireRéseauLauréatProjector> = async (event) => {
    if (event.type === 'RebuildTriggered') {
      await remove<GestionnaireRéseauLauréatLegacyReadModel>(`projet|${event.payload.id}`);
    } else {
      switch (event.type) {
        case 'GestionnaireRéseauProjetDéclaré':
        case 'GestionnaireRéseauProjetModifié':
          await upsert<GestionnaireRéseauLauréatLegacyReadModel>(
            `projet|${
              event.payload.identifiantProjet as `${string}#${string}#${string}#${string}`
            }`,
            {
              identifiantGestionnaire: {
                codeEIC: event.payload.identifiantGestionnaireRéseau,
              },
            },
          );
          break;
      }
    }
  };

  mediator.register('EXECUTE_GESTIONNAIRE_RÉSEAU_LAURÉAT_PROJECTOR', handler);
};
