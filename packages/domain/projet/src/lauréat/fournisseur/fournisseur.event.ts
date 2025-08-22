import type { ChangementFournisseurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
import type { FournisseurImportéEvent } from './importer/importerFournisseur.event';
import type { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';

export type FournisseurEvent =
  | FournisseurImportéEvent
  | ÉvaluationCarboneModifiéeEvent
  | ChangementFournisseurEnregistréEvent;
