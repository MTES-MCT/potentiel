import { Create, Find, Subscribe, Unsubscribe, Update } from '@potentiel/core-domain';
import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
} from './gestionnaireRéseau';
import { propositionTechniqueEtFinancièreTransmiseHandlerFactory } from './raccordement/transmettrePropositionTechniqueEtFinancière/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import { demandeComplèteRaccordementTransmiseHandlerFactory } from './raccordement/transmettreDemandeComplèteRaccordement/handlers/demandeComplèteRaccordementTransmise.handler';
import { dateMiseEnServiceTransmiseHandlerFactory } from './raccordement/transmettreDateMiseEnService/handlers/dateMiseEnServiceTransmise.handler';

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
    subscribe(
      'DateMiseEnServiceTransmise',
      dateMiseEnServiceTransmiseHandlerFactory({
        find,
        update,
      }),
    ),
  ]);
};
