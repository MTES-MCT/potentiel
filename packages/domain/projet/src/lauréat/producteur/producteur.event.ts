import { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
import { ProducteurModifiéEvent } from './modifier/modifierProducteur.event';

export type ProducteurEvent = ChangementProducteurEnregistréEvent | ProducteurModifiéEvent;
