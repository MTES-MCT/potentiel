import { Ports } from '../domain.ports';
import { registerConsulterDossierRaccordementQuery } from './consulter/consulterDossierRaccordement.query';
import { registerListerDossiersRaccordementQuery } from './lister/listerDossierRaccordement.query';
import { demandeComplèteRaccordementeModifiéeHandlerFactory } from './modifierDemandeComplèteRaccordement';
import { registerModifierDemandeComplèteRaccordementCommand } from './modifierDemandeComplèteRaccordement/modifierDemandeComplèteRaccordement.command';
import { propositionTechniqueEtFinancièreModifiéeHandlerFactory } from './modifierPropositiontechniqueEtFinancière';
import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifierPropositiontechniqueEtFinancière/modifierPropositiontechniqueEtFinancière.command';
import { dateMiseEnServiceTransmiseHandlerFactory } from './transmettreDateMiseEnService';
import { registerTransmettreDateMiseEnServiceCommand } from './transmettreDateMiseEnService/transmettreDateMiseEnService.command';
import { demandeComplèteRaccordementTransmiseHandlerFactory } from './transmettreDemandeComplèteRaccordement';
import { registerTransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement/transmettreDemandeComplèteRaccordement.command';
import { registerTransmettreDemandeComplèteRaccordementUseCase } from './transmettreDemandeComplèteRaccordement/transmettreDemandeComplèteRaccordement.usecase';
import { propositionTechniqueEtFinancièreTransmiseHandlerFactory } from './transmettrePropositionTechniqueEtFinancière';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettrePropositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.command';

export const setupRaccordement = ({ commandPorts, queryPorts, eventPorts, subscribe }: Ports) => {
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
  registerTransmettreDemandeComplèteRaccordementUseCase();

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
  ];
};
