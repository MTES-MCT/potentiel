import { AccèsProjetAutoriséEvent } from './autoriser/autoriserAccèsProjet.event.js';
import { AccèsProjetRemplacéEvent } from './remplacer/remplacerAccèsProjet.event.js';
import { AccèsProjetRetiréEvent } from './retirer/retirerAccèsProjet.event.js';

export type AccèsEvent =
  | AccèsProjetAutoriséEvent
  | AccèsProjetRetiréEvent
  | AccèsProjetRemplacéEvent;
