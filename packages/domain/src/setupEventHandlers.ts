import { Create, Subscribe, Unsubscribe, Update } from '@potentiel/core-domain';
import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
  GestionnaireRéseauReadModel,
} from './gestionnaireRéseau';

type Ports = {
  subscribe: Subscribe;
  create: Create<GestionnaireRéseauReadModel>;
  update: Update<GestionnaireRéseauReadModel>;
};

export const setupEventHandlers = async ({
  subscribe,
  create,
  update,
}: Ports): Promise<Unsubscribe[]> => {
  return Promise.all([
    subscribe('GestionnaireRéseauAjouté', gestionnaireRéseauAjoutéHandlerFactory({ create })),
    subscribe('GestionnaireRéseauModifié', gestionnaireRéseauModifiéHandlerFactory({ update })),
  ]);
};
