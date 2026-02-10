import { TâchePlanifiéeAjoutéeEvent } from './ajouter/ajouterTâchePlanifiée.event.js';
import { TâchePlanifiéeAnnuléeEvent } from './annuler/annulerTâchePlanifiée.event.js';
import { TâchePlanifiéeExecutéeEvent } from './exécuter/exécuterTâchePlanifiée.event.js';

export type TâchePlanifiéeEvent =
  | TâchePlanifiéeAjoutéeEvent
  | TâchePlanifiéeAnnuléeEvent
  | TâchePlanifiéeExecutéeEvent;
