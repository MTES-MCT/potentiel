import type { AccèsProjetAutoriséEvent } from './autoriser/autoriserAccèsProjet.event';
import type { AccèsProjetRetiréEvent } from './retirer/retirerAccèsProjet.event';

export type AccèsEvent = AccèsProjetAutoriséEvent | AccèsProjetRetiréEvent;
