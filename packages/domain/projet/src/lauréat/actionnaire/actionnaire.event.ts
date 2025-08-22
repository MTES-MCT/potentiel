import type { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.event';
import type { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.event';
import type { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.event';
import type { ChangementActionnaireEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementActionnaire.event';
import type { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.event';
import type { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.event';
import type { ActionnaireImportéEvent } from './importer/importerActionnaire.event';
import type { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.event';

export type ActionnaireEvent =
  | ActionnaireImportéEvent
  | ActionnaireModifiéEvent
  | ChangementActionnaireAccordéEvent
  | ChangementActionnaireAnnuléEvent
  | ChangementActionnaireDemandéEvent
  | ChangementActionnaireEnregistréEvent
  | ChangementActionnaireRejetéEvent
  | ChangementActionnaireSuppriméEvent;
