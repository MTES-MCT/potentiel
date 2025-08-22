import type { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.event';
import type { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.event';
import type { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.event';
import type { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.event';
import type { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event';
import type { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.event';
import type { PuissanceImportéeEvent } from './importer/importerPuissance.event';
import type { PuissanceModifiéeEvent } from './modifier/modifierPuissance.event';

export type PuissanceEvent =
  | PuissanceImportéeEvent
  | PuissanceModifiéeEvent
  | ChangementPuissanceDemandéEvent
  | ChangementPuissanceAnnuléEvent
  | ChangementPuissanceSuppriméEvent
  | ChangementPuissanceEnregistréEvent
  | ChangementPuissanceAccordéEvent
  | ChangementPuissanceRejetéEvent;
