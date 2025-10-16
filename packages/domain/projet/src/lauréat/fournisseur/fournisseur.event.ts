import { ChangementFournisseurEnregistréEvent } from './changement/miseAJour/enregistrerChangement.event';
import { FournisseurModifiéEvent } from './changement/miseAJour/modifierFournisseur.event';
import { FournisseurImportéEvent } from './importer/importerFournisseur.event';
import { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';

export type FournisseurEvent =
  | FournisseurImportéEvent
  | ÉvaluationCarboneModifiéeEvent
  | ChangementFournisseurEnregistréEvent
  | FournisseurModifiéEvent;
