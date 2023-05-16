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
import { fichierPropositionTechniqueEtFinancièreTransmisHandlerFactory } from './raccordement/transmettrePropositionTechniqueEtFinancière/handlers/fichierPropositionTechniqueEtFinancièreTransmis.handler';

/**
 * @deprecated
 */
type Ports = {
  subscribe: Subscribe;
  eventPorts: {
    create: Create;
    update: Update;
    find: Find;
    remove: Remove;
  };
};

/**
 * @deprecated cette fonction va être à terme merge dans la fonction setupDomain
 */
export const setupEventHandlers = async ({
  subscribe,
  eventPorts,
}: Ports): Promise<Unsubscribe[]> => {
  return Promise.all([
    subscribe('GestionnaireRéseauAjouté', gestionnaireRéseauAjoutéHandlerFactory(eventPorts)),
    subscribe('GestionnaireRéseauModifié', gestionnaireRéseauModifiéHandlerFactory(eventPorts)),
    subscribe(
      'DemandeComplèteDeRaccordementTransmise',
      demandeComplèteRaccordementTransmiseHandlerFactory(eventPorts),
    ),
    subscribe(
      'PropositionTechniqueEtFinancièreTransmise',
      propositionTechniqueEtFinancièreTransmiseHandlerFactory(eventPorts),
    ),
    subscribe('DateMiseEnServiceTransmise', dateMiseEnServiceTransmiseHandlerFactory(eventPorts)),
    subscribe(
      'DemandeComplèteRaccordementModifiée',
      demandeComplèteRaccordementeModifiéeHandlerFactory(eventPorts),
    ),
    subscribe(
      'GestionnaireRéseauProjetModifié',
      gestionnaireRéseauProjetModifiéHandlerFactory(eventPorts),
    ),
    subscribe(
      'PropositionTechniqueEtFinancièreModifiée',
      propositionTechniqueEtFinancièreModifiéeHandlerFactory(eventPorts),
    ),
    subscribe(
      'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory({
        find,
        update,
      }),
    ),
    subscribe(
      'FichierPropositionTechniqueEtFinancièreTransmis',
      fichierPropositionTechniqueEtFinancièreTransmisHandlerFactory({
        find,
        update,
      }),
    ),
  ]);
};
