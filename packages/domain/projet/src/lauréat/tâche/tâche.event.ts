import { TâcheAchevéeEvent } from './achever/acheverTâche.event.js';
import {
  TâcheAjoutéeEvent,
  TâcheRelancéeEvent,
  TâcheRenouvelléeEvent,
} from './ajouter/ajouterTâche.event.js';

export type TâcheEvent =
  | TâcheAjoutéeEvent
  | TâcheRenouvelléeEvent
  | TâcheRelancéeEvent
  | TâcheAchevéeEvent;
