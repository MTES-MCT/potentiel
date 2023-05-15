import { Ports } from '../domain.ports';
import { registerConsulterDossierRaccordementQuery } from './consulter/consulterDossierRaccordement.query';
import { registerListerDossiersRaccordementQuery } from './lister/listerDossierRaccordement.query';
import { registerModifierDemandeComplèteRaccordementCommand } from './modifierDemandeComplèteRaccordement/modifierDemandeComplèteRaccordement.command';
import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifierPropositiontechniqueEtFinancière/modifierPropositiontechniqueEtFinancière.command';
import { registerTransmettreDateMiseEnServiceCommand } from './transmettreDateMiseEnService/transmettreDateMiseEnService.command';
import { registerTransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement/transmettreDemandeComplèteRaccordement.command';
import { registerTransmettreDemandeComplèteRaccordementUseCase } from './transmettreDemandeComplèteRaccordement/transmettreDemandeComplèteRaccordement.usecase';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettrePropositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.command';

export const setupRaccordement = ({ commandPorts, queryPorts }: Ports) => {
  // Query
  registerConsulterDossierRaccordementQuery(queryPorts);
  registerListerDossiersRaccordementQuery(queryPorts);

  // Command
  registerModifierDemandeComplèteRaccordementCommand(commandPorts);
  registerModifierPropositionTechniqueEtFinancièreCommand(commandPorts);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(commandPorts);
  registerTransmettreDemandeComplèteRaccordementCommand(commandPorts);
  registerTransmettreDateMiseEnServiceCommand(commandPorts);

  // Use case
  registerTransmettreDemandeComplèteRaccordementUseCase();
};
