import { ProjetEvent } from './projet/projet.event';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import { RaccordementEvent } from './raccordement/raccordement.event';
import {
  DépôtGarantiesFinancièresEvent,
  EnregistrementGarantiesFinancièresEvent,
  GarantiesFinancièresEvent,
} from './garantiesFinancières/garantiesFinancières.event';
import {
  TypeGarantiesFinancièresEnregistréSnapshotV1,
  AttestationGarantiesFinancièresEnregistréeEvent,
} from './garantiesFinancières/actuelles/enregistrementGarantiesFinancières.event';
import { GarantiesFinancièresDéposéesSnapshotV1 } from './garantiesFinancières/dépôt/dépôtGarantiesFinancières.event';

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
  TypeGarantiesFinancièresEnregistréSnapshotV1,
  AttestationGarantiesFinancièresEnregistréeEvent,
  GarantiesFinancièresDéposéesSnapshotV1,
};
