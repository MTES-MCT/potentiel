import { Create, Find, Subscribe, Unsubscribe, Update } from '@potentiel/core-domain';
import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
} from './gestionnaireRéseau';
import { demandeComplèteRaccordementTransmiseHandlerFactory } from './raccordement/demandeComplèteRaccordement/transmettre/handlers/demandeComplèteRaccordementTransmise.handler';
import { propositionTechniqueEtFinancièreTransmiseHandlerFactory } from './raccordement/transmettrePropositionTechniqueEtFinancière/handlers/propositionTechniqueEtFinancièreTransmise.handler';

type Ports = {
  subscribe: Subscribe;
  create: Create;
  update: Update;
  find: Find;
};

export const setupEventHandlers = async ({
  create,
  find,
  update,
  subscribe,
}: Ports): Promise<Unsubscribe[]> => {
  return Promise.all([
    subscribe('GestionnaireRéseauAjouté', gestionnaireRéseauAjoutéHandlerFactory({ create })),
    subscribe('GestionnaireRéseauModifié', gestionnaireRéseauModifiéHandlerFactory({ update })),
    subscribe(
      'DemandeComplèteDeRaccordementTransmise',
      demandeComplèteRaccordementTransmiseHandlerFactory({
        create,
        find,
        update,
      }),
    ),
    subscribe(
      'PropositionTechniqueEtFinancièreTransmise',
      propositionTechniqueEtFinancièreTransmiseHandlerFactory({
        find,
        update,
      }),
    ),
  ]);
};
