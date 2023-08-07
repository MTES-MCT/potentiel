import { DépôtGarantiesFinancièresEvent } from './dépôtGarantiesFinancières/dépôtGarantiesFinancières.event';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import {
  TypeGarantiesFinancièresEnregistréEventV0,
  AttestationGarantiesFinancièresEnregistréeEvent,
} from './projet/garantiesFinancières/garantiesFinancières.event';
import { ProjetEvent, GarantiesFinancièresEvent } from './projet/projet.event';
import { RaccordementEvent } from './raccordement/raccordement.event';

export type DomainEvents =
  | GestionnaireRéseauEvent
  | RaccordementEvent
  | ProjetEvent
  | DépôtGarantiesFinancièresEvent;

export {
  GestionnaireRéseauEvent,
  ProjetEvent,
  RaccordementEvent,
  GarantiesFinancièresEvent,
  TypeGarantiesFinancièresEnregistréEventV0,
  AttestationGarantiesFinancièresEnregistréeEvent,
  DépôtGarantiesFinancièresEvent,
};
