import { ProjetEvent } from './projet/projet.event';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import { RaccordementEvent } from './raccordement/raccordement.event';
import {
  DépôtGarantiesFinancièresEvent,
  EnregistrementGarantiesFinancièresEvent,
  GarantiesFinancièresEvent,
  GarantiesFinancièresSnapshotEvent,
} from './garantiesFinancières/garantiesFinancières.event';
import { AttestationGarantiesFinancièresEnregistréeEvent } from './garantiesFinancières/actuelles/enregistrementGarantiesFinancières.event';

export type DomainEvents =
  | GestionnaireRéseauEvent
  | RaccordementEvent
  | ProjetEvent
  | GarantiesFinancièresEvent;

export {
  GestionnaireRéseauEvent,
  ProjetEvent,
  RaccordementEvent,
  GarantiesFinancièresEvent,
  DépôtGarantiesFinancièresEvent,
  EnregistrementGarantiesFinancièresEvent,
  AttestationGarantiesFinancièresEnregistréeEvent,
  GarantiesFinancièresSnapshotEvent,
};
