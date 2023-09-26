import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../projet/projet.valueType';
import {
  TypeGarantiesFinancièresEnregistréEventV1,
  AttestationGarantiesFinancièresEnregistréeEventV1,
  GarantiesFinancièresComplètesEnregistréesEventV1,
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
        typeGarantiesFinancières: TypeGarantiesFinancières | 'Type inconnu';
        dateÉchéance: string | 'Date inconnue';
        attestationConstitution: { format: string; date: string } | { attestationAbsente: true };
      };
      dépôt?: {
        typeGarantiesFinancières: TypeGarantiesFinancières | 'Type inconnu';
        dateÉchéance: string | 'Date inconnue';
        attestationConstitution: { format: string; date: string };
        dateDépôt: string;
      };
      dateLimiteDépôt?: string | 'Date inconnue';
    };
  }
>;

export type EnregistrementGarantiesFinancièresEvent =
  | TypeGarantiesFinancièresEnregistréEventV1
  | AttestationGarantiesFinancièresEnregistréeEventV1
  | GarantiesFinancièresComplètesEnregistréesEventV1
  | GarantiesFinancièresSnapshotEventV1;

export type DépôtGarantiesFinancièresEvent =
  | GarantiesFinancièresDéposéesEventV1
  | DépôtGarantiesFinancièresModifiéEventV1
  | GarantiesFinancièresSnapshotEventV1
  | DépôtGarantiesFinancièresSuppriméEventV1
  | DépôtGarantiesFinancièresValidéEventV1;

export type SuiviDépôtsGarantiesFinancièresEvent =
  | GarantiesFinancièresSnapshotEventV1
  | DépôtGarantiesFinancièresValidéEventV1
  | DépôtGarantiesFinancièresSuppriméEventV1
  | GarantiesFinancièresDéposéesEventV1;

export type GarantiesFinancièresEvent =
  | EnregistrementGarantiesFinancièresEvent
  | DépôtGarantiesFinancièresEvent
  | SuiviDépôtsGarantiesFinancièresEvent;
