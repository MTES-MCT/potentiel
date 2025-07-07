import {
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauAjoutéEventV1,
} from './ajouter/ajouter.event';
import {
  GestionnaireRéseauModifiéEvent,
  GestionnaireRéseauModifiéEventV1,
} from './modifier/modifierGestionnaireRéseau.event';

export type GestionnaireRéseauEvent =
  | GestionnaireRéseauAjoutéEventV1
  | GestionnaireRéseauAjoutéEvent
  | GestionnaireRéseauModifiéEventV1
  | GestionnaireRéseauModifiéEvent;
