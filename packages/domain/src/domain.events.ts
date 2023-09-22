import { GestionnaireRéseauProjetEvent } from './projet/lauréat/gestionnaireRéseau/gestionnaireRéseauProjet.event';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import { RaccordementEvent } from './raccordement/raccordement.event';

export type DomainEvents =
  | GestionnaireRéseauEvent
  | GestionnaireRéseauProjetEvent
  | RaccordementEvent;

export { GestionnaireRéseauEvent, GestionnaireRéseauProjetEvent, RaccordementEvent };
