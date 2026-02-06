import {
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauAjoutéEventV1,
} from './ajouter/ajouterGestionnaireRéseau.event.js';
import {
  GestionnaireRéseauModifiéEvent,
  GestionnaireRéseauModifiéEventV1,
} from './modifier/modifierGestionnaireRéseau.event.js';

export type GestionnaireRéseauEvent =
  | GestionnaireRéseauAjoutéEventV1
  | GestionnaireRéseauAjoutéEvent
  | GestionnaireRéseauModifiéEventV1
  | GestionnaireRéseauModifiéEvent;
