import {
  ModifierDemandeComplèteRaccordementDependencies,
  registerModifierDemandeComplèteRaccordementCommand,
} from './modifier/modifierDemandeComplèteRaccordement.command';
import {
  ModifierPropositionTechniqueEtFinancièreDependencies,
  registerModifierPropositionTechniqueEtFinancièreCommand,
} from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { registerModifierDemandeComplèteRaccordementUseCase } from './modifier/modifierDemandeComplèteRaccordement.usecase';
import { registerModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/modifierPropositiontechniqueEtFinancière.usecase';
import {
  ModifierRéférenceDossierRaccordementDependencies,
  registerModifierRéférenceDossierRaccordementCommand,
} from './modifier/modifierRéférenceDossierRaccordement.command';
import { registerModifierRéférenceDossierRaccordementUseCase } from './modifier/modifierRéférenceDossierRaccordement.usecase';
import { registerEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand } from './enregistrer/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';
import { registerEnregistrerPropositionTechniqueEtFinancièreSignéeCommand } from './enregistrer/enregistrerPropositionTechniqueEtFinancièreSignée.command';

export type RaccordementDependencies = ModifierDemandeComplèteRaccordementDependencies &
  ModifierPropositionTechniqueEtFinancièreDependencies &
  ModifierRéférenceDossierRaccordementDependencies;

export const setupRaccordement = (dependencies: RaccordementDependencies) => {
  // Commands
  registerModifierDemandeComplèteRaccordementCommand(dependencies);
  registerModifierPropositionTechniqueEtFinancièreCommand(dependencies);
  registerModifierRéférenceDossierRaccordementCommand(dependencies);
  registerEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand(dependencies);
  registerEnregistrerPropositionTechniqueEtFinancièreSignéeCommand(dependencies);

  // Usecases
  registerModifierDemandeComplèteRaccordementUseCase();
  registerModifierPropositiontechniqueEtFinancièreUseCase();
  registerModifierRéférenceDossierRaccordementUseCase();

  // Sagas
  return [];
};
