import { GestionnaireRéseauEvent } from './gestionnaireRéseau/aggregate/gestionnaireRéseau.aggregate';
import { ProjetEvent } from './projet/aggregate/projet.aggregate';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from './raccordement/demandeCompléteRaccordement/enregisterAccuséRéception/accuséRéceptionDemandeComplèteRaccordementTransmis.event';
import { DemandeComplèteRaccordementModifiéeEvent } from './raccordement/demandeCompléteRaccordement/modifier/demandeComplèteRaccordementModifiée.event';
import { AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent } from './raccordement/demandeCompléteRaccordement/supprimerAccuséRéception/accuséRéceptionDemandeComplèteRaccordementSupprimé.event';
import { DemandeComplèteRaccordementTransmiseEvent } from './raccordement/demandeCompléteRaccordement/transmettre/demandeComplèteRaccordementTransmise.event';
import { DateMiseEnServiceTransmiseEvent } from './raccordement/miseEnService/transmettre/dateMiseEnServiceTransmise.event';
import { PropositionTechniqueEtFinancièreSignéeTransmiseEvent } from './raccordement/propositionTechniqueEtFinancière/enregistrerPropositionTechniqueEtFinancièreSignée/propositionTechniqueEtFinancièreSignéeTransmise.event';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from './raccordement/propositionTechniqueEtFinancière/modifier/propositionTechniqueEtFinancièreModifiée.event';
import { PropositionTechniqueEtFinancièreSignéeSuppriméeEvent } from './raccordement/propositionTechniqueEtFinancière/supprimerPropositionTechniqueEtFinancièreSignée/propositionTechniqueEtFinancièreSignéeSupprimée.event';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from './raccordement/propositionTechniqueEtFinancière/transmettre/propositionTechniqueEtFinancièreTransmise.event';

export type DomainEvents =
  | GestionnaireRéseauEvent
  | ProjetEvent
  | AccuséRéceptionDemandeComplèteRaccordementTransmisEvent
  | DemandeComplèteRaccordementModifiéeEvent
  | AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent
  | DemandeComplèteRaccordementTransmiseEvent
  | DateMiseEnServiceTransmiseEvent
  | PropositionTechniqueEtFinancièreSignéeTransmiseEvent
  | PropositionTechniqueEtFinancièreModifiéeEvent
  | PropositionTechniqueEtFinancièreSignéeSuppriméeEvent
  | PropositionTechniqueEtFinancièreTransmiseEvent;
