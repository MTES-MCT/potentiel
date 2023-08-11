import {
  TypeGarantiesFinancièresEnregistréEventV1,
  TypeGarantiesFinancièresEnregistréSnapshotV1,
  AttestationGarantiesFinancièresEnregistréeEvent,
} from './actuelles/enregistrementGarantiesFinancières.event';
import {
  GarantiesFinancièresDéposéesEventV1,
  DépôtGarantiesFinancièresModifiéEventV1,
  GarantiesFinancièresDéposéesSnapshotV1,
} from './dépôt/dépôtGarantiesFinancières.event';

export type EnregistrementGarantiesFinancièresEvent =
  | TypeGarantiesFinancièresEnregistréSnapshotV1
  | TypeGarantiesFinancièresEnregistréEventV1
  | AttestationGarantiesFinancièresEnregistréeEvent;

export type DépôtGarantiesFinancièresEvent =
  | GarantiesFinancièresDéposéesSnapshotV1
  | GarantiesFinancièresDéposéesEventV1
  | DépôtGarantiesFinancièresModifiéEventV1;

export type GarantiesFinancièresEvent =
  | EnregistrementGarantiesFinancièresEvent
  | DépôtGarantiesFinancièresEvent;
