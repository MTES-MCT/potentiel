import type { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.event.js';
import type { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.event.js';
import type { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.event.js';
import type { ChangementActionnaireEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementActionnaire.event.js';
import type { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.event.js';
import type { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.event.js';
import type { ActionnaireImportéEvent } from './importer/importerActionnaire.event.js';
import type { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.event.js';

export type ActionnaireEvent =
  | ActionnaireImportéEvent
  | ActionnaireModifiéEvent
  | ChangementActionnaireAccordéEvent
  | ChangementActionnaireAnnuléEvent
  | ChangementActionnaireDemandéEvent
  | ChangementActionnaireEnregistréEvent
  | ChangementActionnaireRejetéEvent
  | ChangementActionnaireSuppriméEvent;
