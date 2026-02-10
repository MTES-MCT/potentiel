import { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.event.js';
import { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.event.js';
import { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.event.js';
import { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.event.js';
import { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event.js';
import { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.event.js';
import { PuissanceImportéeEvent } from './importer/importerPuissance.event.js';
import { PuissanceModifiéeEvent } from './modifier/modifierPuissance.event.js';

export type PuissanceEvent =
  | PuissanceImportéeEvent
  | PuissanceModifiéeEvent
  | ChangementPuissanceDemandéEvent
  | ChangementPuissanceAnnuléEvent
  | ChangementPuissanceSuppriméEvent
  | ChangementPuissanceEnregistréEvent
  | ChangementPuissanceAccordéEvent
  | ChangementPuissanceRejetéEvent;
