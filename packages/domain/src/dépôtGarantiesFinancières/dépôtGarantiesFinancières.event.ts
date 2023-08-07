import { DomainEvent } from '@potentiel/core-domain';

export type DépôtGarantiesFinancièresTransmisV0 = DomainEvent<
  'DépôtGarantiesFinancièresTransmis-v0', // legacy
  {
    identifiantProjet: string;
    dateÉchéance?: string;
    attestationConstitution: { format: string; date: string };
    dateDépôt: string;
  }
>;

export type DépôtGarantiesFinancièresTransmisV1 = DomainEvent<
  'DépôtGarantiesFinancièresTransmis-v1',
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
  | DépôtGarantiesFinancièresTransmisV0
  | DépôtGarantiesFinancièresTransmisV1;
