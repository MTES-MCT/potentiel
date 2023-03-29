import { Create, DomainEventHandlerFactory } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../../gestionnaireRéseau.readModel';
import { GestionnaireRéseauAjoutéEvent } from '../gestionnaireRéseauAjouté.event';

type GestionnaireRéseauAjoutéHandlerDependencies = {
  create: Create<GestionnaireRéseauReadModel>;
};

export const gestionnaireRéseauAjoutéHandlerFactory: DomainEventHandlerFactory<
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauAjoutéHandlerDependencies
> =
  ({ create }) =>
  async (event) => {
    await create(`gestionnaire-réseau#${event.payload.codeEIC}`, { ...event.payload });
  };
