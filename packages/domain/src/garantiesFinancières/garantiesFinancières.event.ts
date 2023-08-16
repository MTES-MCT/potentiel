import {
  TypeGarantiesFinancièresEnregistréEvent,
  TypeGarantiesFinancièresEnregistréSnapshot,
  AttestationGarantiesFinancièresEnregistréeEvent,
} from './actuelles/enregistrementGarantiesFinancières.event';
import {
  GarantiesFinancièresDéposéesEvent,
  DépôtGarantiesFinancièresModifiéEvent,
  GarantiesFinancièresDéposéesSnapshot,
} from './dépôt/dépôtGarantiesFinancières.event';

export type EnregistrementGarantiesFinancièresEvent =
  | TypeGarantiesFinancièresEnregistréSnapshot
  | TypeGarantiesFinancièresEnregistréEvent
  | AttestationGarantiesFinancièresEnregistréeEvent;

export type DépôtGarantiesFinancièresEvent =
  | GarantiesFinancièresDéposéesSnapshot
  | GarantiesFinancièresDéposéesEvent
  | DépôtGarantiesFinancièresModifiéEvent;

export type GarantiesFinancièresEvent =
  | EnregistrementGarantiesFinancièresEvent
  | DépôtGarantiesFinancièresEvent;
