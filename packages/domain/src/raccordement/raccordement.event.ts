import { DemandeComplèteRaccordementModifiéeEvent } from './modifier/demandeComplèteRaccordementModifiée.event';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from './modifier/propositionTechniqueEtFinancièreModifiée.event';
import { DateMiseEnServiceTransmiseEvent } from './transmettre/dateMiseEnServiceTransmise.event';
import { DemandeComplèteRaccordementTransmiseEvent } from './transmettre/demandeComplèteRaccordementTransmise.event';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from './transmettre/propositionTechniqueEtFinancièreTransmise.event';

export type RaccordementEvent =
  | DemandeComplèteRaccordementTransmiseEvent
  | DemandeComplèteRaccordementModifiéeEvent
  | PropositionTechniqueEtFinancièreTransmiseEvent
  | PropositionTechniqueEtFinancièreModifiéeEvent
  | DateMiseEnServiceTransmiseEvent;
