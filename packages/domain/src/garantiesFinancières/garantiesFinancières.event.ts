import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../projet/projet.valueType';
import {
  TypeGarantiesFinancièresEnregistréEvent,
  AttestationGarantiesFinancièresEnregistréeEvent,
} from './actuelles/enregistrementGarantiesFinancières.event';
import {
  GarantiesFinancièresDéposéesEvent,
  DépôtGarantiesFinancièresModifiéEvent,
} from './dépôt/dépôtGarantiesFinancières.event';
import { TypeGarantiesFinancières } from './garantiesFinancières.valueType';

export type GarantiesFinancièresSnapshotEvent = DomainEvent<
  'GarantiesFinancièresSnapshot',
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
    };
  }
>;

export type EnregistrementGarantiesFinancièresEvent =
  | TypeGarantiesFinancièresEnregistréEvent
  | AttestationGarantiesFinancièresEnregistréeEvent
  | GarantiesFinancièresSnapshotEvent;

export type DépôtGarantiesFinancièresEvent =
  | GarantiesFinancièresDéposéesEvent
  | DépôtGarantiesFinancièresModifiéEvent
  | GarantiesFinancièresSnapshotEvent;

export type GarantiesFinancièresEvent =
  | EnregistrementGarantiesFinancièresEvent
  | DépôtGarantiesFinancièresEvent;
