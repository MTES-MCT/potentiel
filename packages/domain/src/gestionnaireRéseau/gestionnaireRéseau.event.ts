import { GestionnaireRéseauAjoutéEvent } from './ajouter/gestionnaireRéseauAjouté.event';
import { GestionnaireRéseauModifiéEvent } from './modifier/gestionnaireRéseauModifié.event';

export type GestionnaireRéseauEvent =
  | GestionnaireRéseauModifiéEvent
  | GestionnaireRéseauAjoutéEvent;
