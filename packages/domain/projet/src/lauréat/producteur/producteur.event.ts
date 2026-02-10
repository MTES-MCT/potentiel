import { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event.js';
import { ProducteurImportéEvent } from './importer/importerProducteur.event.js';
import { ProducteurModifiéEvent } from './modifier/modifierProducteur.event.js';

export type ProducteurEvent =
  | ChangementProducteurEnregistréEvent
  | ProducteurModifiéEvent
  | ProducteurImportéEvent;
