import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../projet/projet.valueType';
import {
  TypeGarantiesFinancièresEnregistréEventV1,
  AttestationGarantiesFinancièresEnregistréeEventV1,
} from './actuelles/enregistrementGarantiesFinancières.event';
import {
  GarantiesFinancièresDéposéesEventV1,
  DépôtGarantiesFinancièresModifiéEventV1,
  DépôtGarantiesFinancièresValidéEventV1,
  DépôtGarantiesFinancièresSuppriméEventV1,
} from './dépôt/dépôtGarantiesFinancières.event';
import { TypeGarantiesFinancières } from './garantiesFinancières.valueType';

export type GarantiesFinancièresSnapshotEventV1 = DomainEvent<
  'GarantiesFinancièresSnapshot-v1',
  {
    identifiantProjet: RawIdentifiantProjet;
    aggregate: {
      actuelles?: {
        typeGarantiesFinancières?: TypeGarantiesFinancières;
        dateÉchéance?: string;
        attestationConstitution?: { format: string; date: string };
      };
      dépôt?: {
        typeGarantiesFinancières?: TypeGarantiesFinancières;
        dateÉchéance?: string;
        attestationConstitution: { format: string; date: string };
        dateDépôt: string;
      };
      dateLimiteDépôt?: string;
    };
  }
>;

export type EnregistrementGarantiesFinancièresEvent =
  | TypeGarantiesFinancièresEnregistréEventV1
  | AttestationGarantiesFinancièresEnregistréeEventV1
  | GarantiesFinancièresSnapshotEventV1
  | DépôtGarantiesFinancièresValidéEventV1;

export type DépôtGarantiesFinancièresEvent =
  | GarantiesFinancièresDéposéesEventV1
  | DépôtGarantiesFinancièresModifiéEventV1
  | GarantiesFinancièresSnapshotEventV1
  | DépôtGarantiesFinancièresSuppriméEventV1;

export type SuiviDépôtsGarantiesFinancièresEvent =
  | GarantiesFinancièresSnapshotEventV1
  | DépôtGarantiesFinancièresValidéEventV1
  | DépôtGarantiesFinancièresSuppriméEventV1
  | GarantiesFinancièresDéposéesEventV1;

export type GarantiesFinancièresEvent =
  | EnregistrementGarantiesFinancièresEvent
  | DépôtGarantiesFinancièresEvent
  | SuiviDépôtsGarantiesFinancièresEvent;
