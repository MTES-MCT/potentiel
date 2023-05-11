import { Create, Find, Subscribe, Unsubscribe, Update, Remove } from '@potentiel/core-domain';
import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
} from './gestionnaireRéseau';
import { propositionTechniqueEtFinancièreTransmiseHandlerFactory } from './raccordement/transmettrePropositionTechniqueEtFinancière/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import { demandeComplèteRaccordementTransmiseHandlerFactory } from './raccordement/transmettreDemandeComplèteRaccordement/handlers/demandeComplèteRaccordementTransmise.handler';
import { dateMiseEnServiceTransmiseHandlerFactory } from './raccordement/transmettreDateMiseEnService/handlers/dateMiseEnServiceTransmise.handler';
import { demandeComplèteRaccordementeModifiéeHandlerFactory } from './raccordement/modifierDemandeComplèteRaccordement/handlers/demandeComplèteRaccordementModifiée.handler';
import { gestionnaireRéseauProjetModifiéHandlerFactory } from './projet/handlers/gestionnaireRéseauProjetModifié.handler';
import {
  accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory,
  propositionTechniqueEtFinancièreModifiéeHandlerFactory,
} from './raccordement';

type Ports = {
  subscribe: Subscribe;
  create: Create;
  update: Update;
  find: Find;
  remove: Remove;
};

export const setupEventHandlers = async ({
  create,
  find,
  update,
  subscribe,
  remove,
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
    subscribe(
      'DemandeComplèteRaccordementModifiée',
      demandeComplèteRaccordementeModifiéeHandlerFactory({
        find,
        create,
        remove,
        update,
      }),
    ),
    subscribe(
      'GestionnaireRéseauProjetModifié',
      gestionnaireRéseauProjetModifiéHandlerFactory({ find, create, update }),
    ),
    subscribe(
      'PropositionTechniqueEtFinancièreModifiée',
      propositionTechniqueEtFinancièreModifiéeHandlerFactory({
        find,
        update,
      }),
    ),
    subscribe(
      'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory({
        find,
        update,
      }),
    ),
  ]);
};
