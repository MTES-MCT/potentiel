import {
  ModifierDemandeComplèteRaccordementDependencies,
  registerModifierDemandeComplèteRaccordementCommand,
} from './modifier/modifierDemandeComplèteRaccordement.command';
import {
  ModifierPropositionTechniqueEtFinancièreDependencies,
  registerModifierPropositionTechniqueEtFinancièreCommand,
} from './modifier/modifierPropositiontechniqueEtFinancière.command';
import {
  TransmettreDateMiseEnServiceCommandDependencies,
  registerTransmettreDateMiseEnServiceCommand,
} from './transmettre/transmettreDateMiseEnService.command';
import {
  TransmettreDemandeComplèteRaccordementDependencies,
  registerTransmettreDemandeComplèteRaccordementCommand,
} from './transmettre/transmettreDemandeComplèteRaccordement.command';
import {
  TransmettrePropositionTechniqueEtFinancièreDependencies,
  registerTransmettrePropositionTechniqueEtFinancièreCommand,
} from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import { registerModifierDemandeComplèteRaccordementUseCase } from './modifier/modifierDemandeComplèteRaccordement.usecase';
import { registerModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/modifierPropositiontechniqueEtFinancière.usecase';
import { registerTransmettreDateMiseEnServiceUseCase } from './transmettre/transmettreDateMiseEnService.usecase';
import { registerTransmettreDemandeComplèteRaccordementUseCase } from './transmettre/transmettreDemandeComplèteRaccordement.usecase';
import { registerTransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/transmettrePropositionTechniqueEtFinancière.usecase';
import {
  ModifierRéférenceDossierRaccordementDependencies,
  registerModifierRéférenceDossierRaccordementCommand,
} from './modifier/modifierRéférenceDossierRaccordement.command';
import { registerModifierRéférenceDossierRaccordementUseCase } from './modifier/modifierRéférenceDossierRaccordement.usecase';

export type RaccordementDependencies = ModifierDemandeComplèteRaccordementDependencies &
  ModifierPropositionTechniqueEtFinancièreDependencies &
  ModifierRéférenceDossierRaccordementDependencies &
  TransmettreDateMiseEnServiceCommandDependencies &
  TransmettreDemandeComplèteRaccordementDependencies &
  TransmettrePropositionTechniqueEtFinancièreDependencies;

export const setupRaccordement = (dependencies: RaccordementDependencies) => {
  // Commands
  registerModifierDemandeComplèteRaccordementCommand(dependencies);
  registerModifierPropositionTechniqueEtFinancièreCommand(dependencies);
  registerModifierRéférenceDossierRaccordementCommand(dependencies);
  registerTransmettreDateMiseEnServiceCommand(dependencies);
  registerTransmettreDemandeComplèteRaccordementCommand(dependencies);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(dependencies);

  // Usecases
  registerModifierDemandeComplèteRaccordementUseCase();
  registerModifierPropositiontechniqueEtFinancièreUseCase();
  registerModifierRéférenceDossierRaccordementUseCase();
  registerTransmettreDateMiseEnServiceUseCase();
  registerTransmettreDemandeComplèteRaccordementUseCase();
  registerTransmettrePropositionTechniqueEtFinancièreUseCase();

  // Sagas
  return [];
};
