import { DomainEvent } from '@potentiel/core-domain';

export type GarantiesFinancièresDéposéesSnapshotV1 = DomainEvent<
  'GarantiesFinancièresDéposéesSnapshot-v1', // legacy
  {
    identifiantProjet: string;
    dateÉchéance?: string;
    typeGarantiesFinancières?: `6 mois après achèvement` | 'consignation' | `avec date d'échéance`;
    attestationConstitution: { format: string; date: string };
    dateDépôt: string;
  }
>;

export type GarantiesFinancièresDéposéesEventV1 = DomainEvent<
  'GarantiesFinancièresDéposées-v1',
  {
    identifiantProjet: string;
    attestationConstitution: { format: string; date: string };
    dateDépôt: string;
  } & (
    | {
        typeGarantiesFinancières: `6 mois après achèvement` | 'consignation';
      }
    | {
        typeGarantiesFinancières: `avec date d'échéance`;
        dateÉchéance: string;
      }
  )
>;

export type DépôtGarantiesFinancièresModifiéEventV1 = DomainEvent<
  'DépôtGarantiesFinancièresModifié-v1',
  {
    identifiantProjet: string;
    attestationConstitution: { format: string; date: string };
  } & (
    | {
        typeGarantiesFinancières: `6 mois après achèvement` | 'consignation';
      }
    | {
        typeGarantiesFinancières: `avec date d'échéance`;
        dateÉchéance: string;
      }
  )
>;
