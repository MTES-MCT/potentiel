import { AccèsProjetAutoriséEvent } from './autoriser/autoriserAccèsProjet.event';
import { AccèsProjetRetiréEvent } from './retirer/retirerAccèsProjet.event';

export type AccèsEvent = AccèsProjetAutoriséEvent | AccèsProjetRetiréEvent;
