import type { ChangementFournisseurEnregistréEvent } from './changement/miseAJour/enregistrerChangement.event.js';
import type { FournisseurModifiéEvent } from './changement/miseAJour/modifierFournisseur.event.js';
import type { FournisseurImportéEvent } from './importer/importerFournisseur.event.js';
import type { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event.js';

export type FournisseurEvent =
  | FournisseurImportéEvent
  | ÉvaluationCarboneModifiéeEvent
  | ChangementFournisseurEnregistréEvent
  | FournisseurModifiéEvent;
