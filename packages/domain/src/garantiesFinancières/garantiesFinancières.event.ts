import {
  TypeGarantiesFinancièresEnregistréEventV1,
  TypeGarantiesFinancièresEnregistréEventV0,
  AttestationGarantiesFinancièresEnregistréeEvent,
} from './actuelles/enregistrementGarantiesFinancières.event';
import {
  GarantiesFinancièresDéposéesV1,
  DépôtGarantiesFinancièresModifiéV1,
  GarantiesFinancièresDéposéesSnapshotV1,
} from './dépôt/dépôtGarantiesFinancières.event';

export type EnregistrementGarantiesFinancièresEvent =
  | TypeGarantiesFinancièresEnregistréEventV0
  | TypeGarantiesFinancièresEnregistréEventV1
  | AttestationGarantiesFinancièresEnregistréeEvent;

export type DépôtGarantiesFinancièresEvent =
  | GarantiesFinancièresDéposéesSnapshotV1
  | GarantiesFinancièresDéposéesV1
  | DépôtGarantiesFinancièresModifiéV1;

export type GarantiesFinancièresEvent =
  | EnregistrementGarantiesFinancièresEvent
  | DépôtGarantiesFinancièresEvent;
