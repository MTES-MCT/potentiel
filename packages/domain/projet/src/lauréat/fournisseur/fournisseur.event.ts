import { ChangementFournisseurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
import { FournisseurImportéEvent } from './importer/importerFournisseur.event';
import { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';

export type FournisseurEvent =
  | FournisseurImportéEvent
  | ÉvaluationCarboneModifiéeEvent
  | ChangementFournisseurEnregistréEvent;
