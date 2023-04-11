import { Create, Find, Subscribe, Unsubscribe, Update } from '@potentiel/core-domain';
import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
  GestionnaireRéseauReadModel,
} from './gestionnaireRéseau';
import { demandeComplèteRaccordementTransmiseHandlerFactory } from './raccordement/demandeComplèteRaccordement/transmettre/handlers/demandeComplèteRaccordementTransmise.handler';
import { DemandeComplèteRaccordementReadModel } from './raccordement/demandeComplèteRaccordement/consulter/demandeComplèteRaccordement.readModel';
import { ListeDemandeComplèteRaccordementReadModel } from './raccordement/demandeComplèteRaccordement/lister/listeDemandeComplèteRaccordement.readModel';

type Ports = {
  subscribe: Subscribe;
  createGestionnaireRéseau: Create<GestionnaireRéseauReadModel>;
  update: Update<GestionnaireRéseauReadModel>;
  findGestionnaireRéseau: Find<GestionnaireRéseauReadModel>;
  findListeDemandeComplèteRaccordement: Find<ListeDemandeComplèteRaccordementReadModel>;
  createListeDemandeComplèteRaccordement: Create<ListeDemandeComplèteRaccordementReadModel>;
  createDemandeComplèteRaccordement: Create<DemandeComplèteRaccordementReadModel>;
  updateListeDemandeComplèteRaccordement: Update<ListeDemandeComplèteRaccordementReadModel>;
};

export const setupEventHandlers = async ({
  subscribe,
  createGestionnaireRéseau,
  update,
  createDemandeComplèteRaccordement,
  createListeDemandeComplèteRaccordement,
  findGestionnaireRéseau,
  findListeDemandeComplèteRaccordement,
  updateListeDemandeComplèteRaccordement,
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
        createDemandeComplèteRaccordement: createDemandeComplèteRaccordement,
        createListeDemandeComplèteRaccordement,
        findGestionnaireRéseau,
        findListeDemandeComplèteRaccordement,
        updateListeDemandeComplèteRaccordement,
      }),
    ),
  ]);
};
