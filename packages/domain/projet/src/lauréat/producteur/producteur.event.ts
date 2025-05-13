import { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
import { ProducteurImportéEvent } from './importer/importerProducteur.event';
import { ProducteurModifiéEvent } from './modifier/modifierProducteur.event';

export type ProducteurEvent =
  | ChangementProducteurEnregistréEvent
  | ProducteurModifiéEvent
  | ProducteurImportéEvent;
