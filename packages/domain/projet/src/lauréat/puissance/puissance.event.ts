import { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.event';
import { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.event';
import { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.event';
import { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.event';
import { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event';
import { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.event';
import { PuissanceImportéeEvent } from './importer/importerPuissance.event';
import { PuissanceModifiéeEvent } from './modifier/modifierPuissance.event';

export type PuissanceEvent =
  | PuissanceImportéeEvent
  | PuissanceModifiéeEvent
  | ChangementPuissanceDemandéEvent
  | ChangementPuissanceAnnuléEvent
  | ChangementPuissanceSuppriméEvent
  | ChangementPuissanceEnregistréEvent
  | ChangementPuissanceAccordéEvent
  | ChangementPuissanceRejetéEvent;
