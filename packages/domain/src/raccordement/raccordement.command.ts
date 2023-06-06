import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand } from './enregistrer/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';
import { EnregistrerPropositionTechniqueEtFinancièreSignéeCommand } from './enregistrer/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { ModifierDemandeComplèteRaccordementCommand } from './modifier/modifierDemandeComplèteRaccordement.command';
import { ModifierPropositionTechniqueEtFinancièreCommand } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { TransmettreDateMiseEnServiceCommand } from './transmettre/transmettreDateMiseEnService.command';
import { TransmettreDemandeComplèteRaccordementCommand } from './transmettre/transmettreDemandeComplèteRaccordement.command';
import { TransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';

export type RaccordementCommand =
  | EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand
  | EnregistrerPropositionTechniqueEtFinancièreSignéeCommand
  | ModifierDemandeComplèteRaccordementCommand
  | ModifierPropositionTechniqueEtFinancièreCommand
  | TransmettreDateMiseEnServiceCommand
  | TransmettreDemandeComplèteRaccordementCommand
  | TransmettrePropositionTechniqueEtFinancièreCommand;
