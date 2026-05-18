import type { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.event.js';
import type { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.event.js';
import type { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.event.js';
import type { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.event.js';
import type { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event.js';
import type { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.event.js';
import type { PuissanceImportéeEvent } from './importer/importerPuissance.event.js';
import type { PuissanceModifiéeEvent } from './modifier/modifierPuissance.event.js';

export type PuissanceEvent =
  | PuissanceImportéeEvent
  | PuissanceModifiéeEvent
  | ChangementPuissanceDemandéEvent
  | ChangementPuissanceAnnuléEvent
  | ChangementPuissanceSuppriméEvent
  | ChangementPuissanceEnregistréEvent
  | ChangementPuissanceAccordéEvent
  | ChangementPuissanceRejetéEvent;
