import { Create, Find, Subscribe, Unsubscribe, Update } from '@potentiel/core-domain';
import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
  GestionnaireRéseauReadModel,
} from './gestionnaireRéseau';
import { demandeComplèteRaccordementTransmiseHandlerFactory } from './raccordement/demandeComplèteRaccordement/transmettre/handlers/demandeComplèteRaccordementTransmise.handler';
import { DemandeComplèteRaccordementReadModel } from './raccordement/demandeComplèteRaccordement/consulter/demandeComplèteRaccordement.readModel';

type Ports = {
  subscribe: Subscribe;
  createGestionnaireRéseau: Create<GestionnaireRéseauReadModel>;
  update: Update<GestionnaireRéseauReadModel>;
  find: Find<GestionnaireRéseauReadModel>;

  createDemandeComplèteRaccordement: Create<DemandeComplèteRaccordementReadModel>;
};

export const setupEventHandlers = async ({
  subscribe,
  createGestionnaireRéseau,
  update,
  createDemandeComplèteRaccordement,
  find,
}: Ports): Promise<Unsubscribe[]> => {
  return Promise.all([
    subscribe(
      'GestionnaireRéseauAjouté',
      gestionnaireRéseauAjoutéHandlerFactory({ create: createGestionnaireRéseau }),
    ),
    subscribe('GestionnaireRéseauModifié', gestionnaireRéseauModifiéHandlerFactory({ update })),
    subscribe(
      'DemandeComplèteDeRaccordementTransmise',
      demandeComplèteRaccordementTransmiseHandlerFactory({
        create: createDemandeComplèteRaccordement,
        find,
      }),
    ),
  ]);
};
