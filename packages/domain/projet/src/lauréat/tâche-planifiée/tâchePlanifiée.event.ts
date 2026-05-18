import type { TâchePlanifiéeAjoutéeEvent } from './ajouter/ajouterTâchePlanifiée.event.js';
import type { TâchePlanifiéeAnnuléeEvent } from './annuler/annulerTâchePlanifiée.event.js';
import type { TâchePlanifiéeExecutéeEvent } from './exécuter/exécuterTâchePlanifiée.event.js';

export type TâchePlanifiéeEvent =
  | TâchePlanifiéeAjoutéeEvent
  | TâchePlanifiéeAnnuléeEvent
  | TâchePlanifiéeExecutéeEvent;
