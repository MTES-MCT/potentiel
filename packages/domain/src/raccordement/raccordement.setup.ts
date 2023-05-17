import { DomainDependencies } from '../domain.dependencies';
import {
  registerModifierDemandeComplèteRaccordementCommand,
  demandeComplèteRaccordementeModifiéeHandlerFactory,
} from './demandeCompléteRaccordement/modifier';
import {
  registerTransmettreDemandeComplèteRaccordementCommand,
  registerTransmettreDemandeComplèteRaccordementUseCase,
  demandeComplèteRaccordementTransmiseHandlerFactory,
  accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory,
} from './demandeCompléteRaccordement/transmettre';
import { registerConsulterDossierRaccordementQuery } from './dossierRaccordement/consulter';
import { registerListerDossiersRaccordementQuery } from './dossierRaccordement/lister/listerDossierRaccordement.query';
import {
  registerTransmettreDateMiseEnServiceCommand,
  dateMiseEnServiceTransmiseHandlerFactory,
} from './miseEnService/transmettre';
import {
  registerModifierPropositionTechniqueEtFinancièreCommand,
  propositionTechniqueEtFinancièreModifiéeHandlerFactory,
} from './propositionTechniqueEtFinancière/modifier';
import {
  registerTransmettrePropositionTechniqueEtFinancièreCommand,
  propositionTechniqueEtFinancièreTransmiseHandlerFactory,
} from './propositionTechniqueEtFinancière/transmettre';
import { fichierPropositionTechniqueEtFinancièreTransmisHandlerFactory } from './propositionTechniqueEtFinancière/transmettre/handlers/fichierPropositionTechniqueEtFinancièreTransmis.handler';

export const setupRaccordement = ({
  command,
  query: queryPorts,
  event: eventPorts,
  subscribe,
}: DomainDependencies) => {
  // Queries
  registerConsulterDossierRaccordementQuery(queryPorts);
  registerListerDossiersRaccordementQuery(queryPorts);

  // Commands
  registerModifierDemandeComplèteRaccordementCommand(commandPorts);
  registerModifierPropositionTechniqueEtFinancièreCommand(commandPorts);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(commandPorts);
  registerTransmettreDemandeComplèteRaccordementCommand(commandPorts);
  registerTransmettreDateMiseEnServiceCommand(commandPorts);

  // Use cases
  registerTransmettreDemandeComplèteRaccordementUseCase(commandPorts);

  return [
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
      'PropositionTechniqueEtFinancièreModifiée',
      propositionTechniqueEtFinancièreModifiéeHandlerFactory(eventPorts),
    ),
    subscribe(
      'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory(eventPorts),
    ),
    subscribe(
      'FichierPropositionTechniqueEtFinancièreTransmis',
      fichierPropositionTechniqueEtFinancièreTransmisHandlerFactory(eventPorts),
    ),
  ];
};
