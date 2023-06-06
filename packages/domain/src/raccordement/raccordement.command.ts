import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand } from './enregistrer/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';
import { EnregistrerPropositionTechniqueEtFinancièreSignéeCommand } from './enregistrer/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { ModifierAccuséRéceptionDemandeComplèteRaccordementCommand } from './modifier/modifierAccuséRéceptionDemandeComplèteRaccordement.command';
import { ModifierDemandeComplèteRaccordementCommand } from './modifier/modifierDemandeComplèteRaccordement.command';
import { ModifierPropositionTechniqueEtFinancièreSignéeCommand } from './modifier/modifierPropositionTechniqueEtFinancièreSignée.command';
import { ModifierPropositionTechniqueEtFinancièreCommand } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { TransmettreDateMiseEnServiceCommand } from './transmettre/transmettreDateMiseEnService.command';
import { TransmettreDemandeComplèteRaccordementCommand } from './transmettre/transmettreDemandeComplèteRaccordement.command';
import { TransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';

export type RaccordementCommand =
  | EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand
  | EnregistrerPropositionTechniqueEtFinancièreSignéeCommand
  | ModifierAccuséRéceptionDemandeComplèteRaccordementCommand
  | ModifierDemandeComplèteRaccordementCommand
  | ModifierPropositionTechniqueEtFinancièreCommand
  | ModifierPropositionTechniqueEtFinancièreSignéeCommand
  | TransmettreDateMiseEnServiceCommand
  | TransmettreDemandeComplèteRaccordementCommand
  | TransmettrePropositionTechniqueEtFinancièreCommand;
