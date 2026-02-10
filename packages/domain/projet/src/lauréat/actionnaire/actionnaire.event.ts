import { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.event.js';
import { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.event.js';
import { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.event.js';
import { ChangementActionnaireEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementActionnaire.event.js';
import { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.event.js';
import { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.event.js';
import { ActionnaireImportéEvent } from './importer/importerActionnaire.event.js';
import { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.event.js';

export type ActionnaireEvent =
  | ActionnaireImportéEvent
  | ActionnaireModifiéEvent
  | ChangementActionnaireAccordéEvent
  | ChangementActionnaireAnnuléEvent
  | ChangementActionnaireDemandéEvent
  | ChangementActionnaireEnregistréEvent
  | ChangementActionnaireRejetéEvent
  | ChangementActionnaireSuppriméEvent;
