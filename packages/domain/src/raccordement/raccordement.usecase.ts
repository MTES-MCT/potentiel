import { ModifierDemandeComplèteRaccordementUseCase } from './modifier/modifierDemandeComplèteRaccordement.usecase';
import { ModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/modifierPropositiontechniqueEtFinancière.usecase';
import { TransmettreDateMiseEnServiceUseCase } from './transmettre/transmettreDateMiseEnService.usecase';
import { TransmettreDemandeComplèteRaccordementUseCase } from './transmettre/transmettreDemandeComplèteRaccordement.usecase';
import { TransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/transmettrePropositionTechniqueEtFinancière.usecase';

export type RaccordementUsecase =
  | ModifierDemandeComplèteRaccordementUseCase
  | ModifierPropositiontechniqueEtFinancièreUseCase
  | TransmettreDateMiseEnServiceUseCase
  | TransmettreDemandeComplèteRaccordementUseCase
  | TransmettrePropositionTechniqueEtFinancièreUseCase;
