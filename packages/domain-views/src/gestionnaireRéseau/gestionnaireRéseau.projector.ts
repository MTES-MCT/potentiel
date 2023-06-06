import { Message, MessageHandler, mediator } from 'mediateur';
import { GestionnaireRéseauEvent } from '@potentiel/domain';
import { GestionnaireRéseauReadModel } from './gestionnaireRéseau.readModel';
import { Create, Update } from '../readModel';

export type ExecuteGestionnaireRéseauProjector = Message<
  'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR',
  GestionnaireRéseauEvent
>;

export type GestionnaireRéseauProjectorDependencies = {
  create: Create;
  update: Update;
};

export const registerGestionnaireRéseauProjector = ({
  create,
  update,
}: GestionnaireRéseauProjectorDependencies) => {
  const handler: MessageHandler<ExecuteGestionnaireRéseauProjector> = async (event) => {
    switch (event.type) {
      case 'GestionnaireRéseauAjouté':
        await create<GestionnaireRéseauReadModel>(`gestionnaire-réseau#${event.payload.codeEIC}`, {
          ...event.payload,
        });
        break;
      case 'GestionnaireRéseauModifié':
        await update<GestionnaireRéseauReadModel>(`gestionnaire-réseau#${event.payload.codeEIC}`, {
          ...event.payload,
        });
    }
  };

  mediator.register('EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR', handler);
};
