import { LoadAggregate } from '@potentiel-domain/core';
import { registerModifierDemandeComplèteRaccordementUseCase } from './modifier/modifierDemandeComplèteRaccordement.usecase';
import { registerModifierGestionnaireRéseauRaccordementUseCase } from './modifier/modifierGestionnaireRéseauRaccordement.usecase';
import { registerModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/modifierPropositiontechniqueEtFinancière.usecase';
import { registerModifierRéférenceDossierRaccordementUseCase } from './modifier/modifierRéférenceDossierRaccordement.usecase';
import { registerTransmettreDateMiseEnServiceUseCase } from './transmettre/transmettreDateMiseEnService.usecase';
import { registerTransmettreDemandeComplèteRaccordementUseCase } from './transmettre/transmettreDemandeComplèteRaccordement.usecase';
import { registerTransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/transmettrePropositionTechniqueEtFinancière.usecase';

import { registerModifierDemandeComplèteRaccordementCommand } from './modifier/modifierDemandeComplèteRaccordement.command';
import { registerModifierGestionnaireRéseauProjetCommand } from './modifier/modifierGestionnaireRéseauRaccordement.command';
import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { registerModifierRéférenceDossierRaccordementCommand } from './modifier/modifierRéférenceDossierRaccordement.command';
import { registerTransmettreDateMiseEnServiceCommand } from './transmettre/transmettreDateMiseEnService.command';
import { registerTransmettreDemandeComplèteRaccordementCommand } from './transmettre/transmettreDemandeComplèteRaccordement.command';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';

export type RaccordementQueryDependencies = {};

export type RaccordementCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerRaccordementUseCases = ({
  loadAggregate,
}: RaccordementCommandDependencies) => {
  registerModifierDemandeComplèteRaccordementCommand(loadAggregate);
  registerModifierGestionnaireRéseauProjetCommand(loadAggregate);
  registerModifierPropositionTechniqueEtFinancièreCommand(loadAggregate);
  registerModifierRéférenceDossierRaccordementCommand(loadAggregate);
  registerTransmettreDateMiseEnServiceCommand(loadAggregate);
  registerTransmettreDemandeComplèteRaccordementCommand(loadAggregate);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(loadAggregate);

  registerModifierDemandeComplèteRaccordementUseCase();
  registerModifierGestionnaireRéseauRaccordementUseCase();
  registerModifierPropositiontechniqueEtFinancièreUseCase();
  registerModifierRéférenceDossierRaccordementUseCase();
  registerTransmettreDateMiseEnServiceUseCase();
  registerTransmettreDemandeComplèteRaccordementUseCase();
  registerTransmettrePropositionTechniqueEtFinancièreUseCase();
};

export const registerRaccordementQueries = (dependencies: RaccordementQueryDependencies) => {};
