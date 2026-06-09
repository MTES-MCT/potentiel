import type { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event.js';
import type { ProducteurImportéEvent } from './importer/importerProducteur.event.js';
import type { ProducteurModifiéEvent } from './modifier/modifierProducteur.event.js';
import type { NuméroIdentificationCorrigéEvent } from './numéroIdentification/corriger/corrigerNuméroIdentification.event.js';

export type ProducteurEvent =
  | ChangementProducteurEnregistréEvent
  | ProducteurModifiéEvent
  | ProducteurImportéEvent
  | NuméroIdentificationCorrigéEvent;
