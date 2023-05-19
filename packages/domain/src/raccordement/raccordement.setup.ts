import { DomainDependencies } from '../domain.dependencies';


import {
  registerTransmettreDemandeComplèteRaccordementCommand,
  registerTransmettreDemandeComplèteRaccordementUseCase,
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

  registerModifierPropositionTechniqueEtFinancièreCommand(commandPorts);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(commandPorts);
  registerTransmettreDemandeComplèteRaccordementCommand(commandPorts);
  registerTransmettreDateMiseEnServiceCommand(commandPorts);

  // Use cases
  registerTransmettreDemandeComplèteRaccordementUseCase(commandPorts);

  return [
    subscribe(
      'PropositionTechniqueEtFinancièreTransmise',
      propositionTechniqueEtFinancièreTransmiseHandlerFactory(eventPorts),
    ),
    subscribe('DateMiseEnServiceTransmise', dateMiseEnServiceTransmiseHandlerFactory(eventPorts)),

    subscribe(
      'PropositionTechniqueEtFinancièreModifiée',
      propositionTechniqueEtFinancièreModifiéeHandlerFactory(eventPorts),
    ),

    subscribe(
      'FichierPropositionTechniqueEtFinancièreTransmis',
      fichierPropositionTechniqueEtFinancièreTransmisHandlerFactory(eventPorts),
    ),
  ];
};
