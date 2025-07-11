import { TâchePlanifiéeAjoutéeEvent } from './ajouter/ajouterTâchePlanifiée.event';
import { TâchePlanifiéeAnnuléeEvent } from './annuler/annulerTâchePlanifiée.event';
import { TâchePlanifiéeExecutéeEvent } from './exécuter/exécuterTâchePlanifiée.event';

export type TâchePlanifiéeEvent =
  | TâchePlanifiéeAjoutéeEvent
  | TâchePlanifiéeAnnuléeEvent
  | TâchePlanifiéeExecutéeEvent;
