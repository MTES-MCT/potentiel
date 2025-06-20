import { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.event';
import { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.event';
import { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.event';
import { ChangementActionnaireEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementActionnaire.event';
import { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.event';
import { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.event';
import { ActionnaireImportéEvent } from './importer/importerActionnaire.event';
import { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.event';

export type ActionnaireEvent =
  | ActionnaireImportéEvent
  | ActionnaireModifiéEvent
  | ChangementActionnaireAccordéEvent
  | ChangementActionnaireAnnuléEvent
  | ChangementActionnaireDemandéEvent
  | ChangementActionnaireEnregistréEvent
  | ChangementActionnaireRejetéEvent
  | ChangementActionnaireSuppriméEvent;
