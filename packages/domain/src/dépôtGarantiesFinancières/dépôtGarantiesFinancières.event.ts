import { DomainEvent } from '@potentiel/core-domain';

export type GarantiesFinancièresDéposéesV0 = DomainEvent<
  'GarantiesFinancièresDéposées-v0', // legacy
  {
    identifiantProjet: string;
    dateÉchéance?: string;
    typeGarantiesFinancières?: `6 mois après achèvement` | 'consignation' | `avec date d'échéance`;
    attestationConstitution: { format: string; date: string };
    dateDépôt: string;
  }
>;

export type GarantiesFinancièresDéposéesV1 = DomainEvent<
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

export type DépôtGarantiesFinancièresEvent =
  | GarantiesFinancièresDéposéesV0
  | GarantiesFinancièresDéposéesV1;
