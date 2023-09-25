import { GestionnaireRéseauProjetEvent } from './projet/lauréat/gestionnaireRéseau/gestionnaireRéseauProjet.event';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import { RaccordementEvent } from './raccordement/raccordement.event';
import { AbandonEvent } from './projet/lauréat/abandon/abandon.event';

export type DomainEvents =
  | AbandonEvent
  | GestionnaireRéseauEvent
  | GestionnaireRéseauProjetEvent
  | RaccordementEvent;

export { GestionnaireRéseauEvent, GestionnaireRéseauProjetEvent, RaccordementEvent, AbandonEvent };
