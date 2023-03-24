import { Create, DomainEventHandler } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../../gestionnaireRéseau.readModel';
import { GestionnaireRéseauAjoutéEvent } from '../gestionnaireRéseauAjouté.event';

export const gestionnaireRéseauAjoutéHandlerFactory =
  (
    create: Create<GestionnaireRéseauReadModel>,
  ): DomainEventHandler<GestionnaireRéseauAjoutéEvent> =>
  async (event) => {
    await create(`gestionnaire-réseau#${event.payload.codeEIC}`, { ...event.payload });
  };
