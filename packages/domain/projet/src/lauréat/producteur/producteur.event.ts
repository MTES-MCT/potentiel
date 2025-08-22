import type { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
import type { ProducteurImportéEvent } from './importer/importerProducteur.event';
import type { ProducteurModifiéEvent } from './modifier/modifierProducteur.event';

export type ProducteurEvent =
  | ChangementProducteurEnregistréEvent
  | ProducteurModifiéEvent
  | ProducteurImportéEvent;
