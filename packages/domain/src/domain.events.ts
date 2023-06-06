import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import { ProjetEvent } from './projet/projet.event';
import { RaccordementEvent } from './raccordement/raccordement.event';

export type DomainEvents = GestionnaireRéseauEvent | ProjetEvent | RaccordementEvent;

export { GestionnaireRéseauEvent, ProjetEvent, RaccordementEvent };
