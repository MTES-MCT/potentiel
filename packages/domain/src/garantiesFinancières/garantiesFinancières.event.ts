import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../projet/projet.valueType';
import {
  GarantiesFinancièresEnregistréesEventV1,
  TypeGarantiesFinancièresImportéEventV1,
} from './actuelles/enregistrementGarantiesFinancières.event';
import {
  GarantiesFinancièresDéposéesEventV1,
  DépôtGarantiesFinancièresModifiéEventV1,
  DépôtGarantiesFinancièresValidéEventV1,
  DépôtGarantiesFinancièresSuppriméEventV1,
} from './dépôt/dépôtGarantiesFinancières.event';

export type GarantiesFinancièresSnapshotEventV1 = DomainEvent<
  'GarantiesFinancièresSnapshot-v1',
  {
    identifiantProjet: RawIdentifiantProjet;
    aggregate: {
      actuelles?: {
        typeGarantiesFinancières:
          | `avec date d'échéance`
          | `consignation`
          | `6 mois après achèvement`
          | 'Type inconnu';
        dateÉchéance: string | 'Date inconnue';
        attestationConstitution: { format: string; date: string } | { attestationAbsente: true };
      };
      dépôt?: {
        typeGarantiesFinancières:
          | `avec date d'échéance`
          | `consignation`
          | `6 mois après achèvement`
          | 'Type inconnu';
        dateÉchéance: string | 'Date inconnue';
        attestationConstitution: { format: string; date: string };
        dateDépôt: string;
      };
      dateLimiteDépôt?: string | 'Date inconnue';
    };
  }
>;

export type EnregistrementGarantiesFinancièresEvent =
  | GarantiesFinancièresSnapshotEventV1
  | TypeGarantiesFinancièresImportéEventV1
  | GarantiesFinancièresEnregistréesEventV1;

export type DépôtGarantiesFinancièresEvent =
  | GarantiesFinancièresSnapshotEventV1
  | GarantiesFinancièresDéposéesEventV1
  | DépôtGarantiesFinancièresModifiéEventV1
  | DépôtGarantiesFinancièresSuppriméEventV1
  | DépôtGarantiesFinancièresValidéEventV1;

export type SuiviDépôtsGarantiesFinancièresEvent =
  | GarantiesFinancièresSnapshotEventV1
  | GarantiesFinancièresDéposéesEventV1
  | DépôtGarantiesFinancièresValidéEventV1
  | DépôtGarantiesFinancièresSuppriméEventV1;

export type GarantiesFinancièresEvent =
  | EnregistrementGarantiesFinancièresEvent
  | DépôtGarantiesFinancièresEvent
  | SuiviDépôtsGarantiesFinancièresEvent;
