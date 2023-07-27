import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import { GarantiesFinancièresEvent, GestionnaireRéseauProjetEvent } from './projet/projet.event';
import { RaccordementEvent } from './raccordement/raccordement.event';

export type DomainEvents =
  | GestionnaireRéseauEvent
  | GestionnaireRéseauProjetEvent
  | RaccordementEvent
  | GarantiesFinancièresEvent;

export {
  GestionnaireRéseauEvent,
  GestionnaireRéseauProjetEvent as ProjetEvent,
  RaccordementEvent,
  GarantiesFinancièresEvent,
};
