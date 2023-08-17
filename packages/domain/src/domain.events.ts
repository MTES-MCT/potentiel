import { ProjetEvent } from './projet/projet.event';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import { RaccordementEvent } from './raccordement/raccordement.event';
import {
  DépôtGarantiesFinancièresEvent,
  EnregistrementGarantiesFinancièresEvent,
  GarantiesFinancièresEvent,
  GarantiesFinancièresSnapshotEventV1,
} from './garantiesFinancières/garantiesFinancières.event';
import { AttestationGarantiesFinancièresEnregistréeEventV1 } from './garantiesFinancières/actuelles/enregistrementGarantiesFinancières.event';

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
  AttestationGarantiesFinancièresEnregistréeEventV1 as AttestationGarantiesFinancièresEnregistréeEvent,
  GarantiesFinancièresSnapshotEventV1 as GarantiesFinancièresSnapshotEvent,
};
