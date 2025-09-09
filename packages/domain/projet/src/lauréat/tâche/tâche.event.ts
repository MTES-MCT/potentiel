import { TâcheAchevéeEvent } from './achever/acheverTâche.event';
import {
  TâcheAjoutéeEvent,
  TâcheRelancéeEvent,
  TâcheRenouvelléeEvent,
} from './ajouter/ajouterTâche.event';

export type TâcheEvent =
  | TâcheAjoutéeEvent
  | TâcheRenouvelléeEvent
  | TâcheRelancéeEvent
  | TâcheAchevéeEvent;
