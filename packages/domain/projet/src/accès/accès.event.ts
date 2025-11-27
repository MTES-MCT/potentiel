import { AccèsProjetAutoriséEvent } from './autoriser/autoriserAccèsProjet.event';
import { AccèsProjetRemplacéEvent } from './remplacer/remplacerAccèsProjet.event';
import { AccèsProjetRetiréEvent } from './retirer/retirerAccèsProjet.event';

export type AccèsEvent =
  | AccèsProjetAutoriséEvent
  | AccèsProjetRetiréEvent
  | AccèsProjetRemplacéEvent;
