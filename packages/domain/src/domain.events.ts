import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import { ProjetEvent, GarantiesFinancièresEvent } from './projet/projet.event';
import { RaccordementEvent } from './raccordement/raccordement.event';

export type DomainEvents = GestionnaireRéseauEvent | RaccordementEvent | ProjetEvent;

export { GestionnaireRéseauEvent, ProjetEvent, RaccordementEvent, GarantiesFinancièresEvent };
