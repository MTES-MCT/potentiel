import { ChangementFournisseurEnregistréEvent } from './changement/miseAJour/enregistrerChangement.event.js';
import { FournisseurModifiéEvent } from './changement/miseAJour/modifierFournisseur.event.js';
import { FournisseurImportéEvent } from './importer/importerFournisseur.event.js';
import { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event.js';

export type FournisseurEvent =
  | FournisseurImportéEvent
  | ÉvaluationCarboneModifiéeEvent
  | ChangementFournisseurEnregistréEvent
  | FournisseurModifiéEvent;
