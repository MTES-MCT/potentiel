import type { AccèsProjetAutoriséEvent } from './autoriser/autoriserAccèsProjet.event.js';
import type { AccèsProjetRemplacéEvent } from './remplacer/remplacerAccèsProjet.event.js';
import type { AccèsProjetRetiréEvent } from './retirer/retirerAccèsProjet.event.js';

export type AccèsEvent =
  | AccèsProjetAutoriséEvent
  | AccèsProjetRetiréEvent
  | AccèsProjetRemplacéEvent;
