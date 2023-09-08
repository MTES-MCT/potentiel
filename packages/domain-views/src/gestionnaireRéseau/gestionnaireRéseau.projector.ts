import { Message, MessageHandler, mediator } from 'mediateur';
import { GestionnaireRéseauEvent } from '@potentiel/domain';
import { GestionnaireRéseauReadModel } from './gestionnaireRéseau.readModel';
import { Create, Update, Remove, RebuildTriggered } from '@potentiel/core-domain-views';

export type ExecuteGestionnaireRéseauProjector = Message<
  'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR',
  GestionnaireRéseauEvent | RebuildTriggered
>;

export type GestionnaireRéseauProjectorDependencies = {
  create: Create;
  update: Update;
  remove: Remove;
};

export const registerGestionnaireRéseauProjector = ({
  create,
  update,
  remove,
}: GestionnaireRéseauProjectorDependencies) => {
  const handler: MessageHandler<ExecuteGestionnaireRéseauProjector> = async (event) => {
    switch (event.type) {
      case 'RebuildTriggered':
        await remove<GestionnaireRéseauReadModel>(`gestionnaire-réseau|${event.payload.id}`);
        break;
      case 'GestionnaireRéseauAjouté':
        await create<GestionnaireRéseauReadModel>(`gestionnaire-réseau|${event.payload.codeEIC}`, {
          ...event.payload,
        });
        break;
      case 'GestionnaireRéseauModifié':
        await update<GestionnaireRéseauReadModel>(`gestionnaire-réseau|${event.payload.codeEIC}`, {
          ...event.payload,
        });
    }
  };

  mediator.register('EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR', handler);
};
