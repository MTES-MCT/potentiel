import { DomainEvent } from '@potentiel/core-domain';

export type TypeGarantiesFinancièresEnregistréEventV0 = DomainEvent<
  'TypeGarantiesFinancièresEnregistré-v0',
  {
    identifiantProjet: string;
  } & (
    | {
        typeGarantiesFinancières: `6 mois après achèvement` | 'consignation';
      }
    | {
        typeGarantiesFinancières: `avec date d'échéance`;
        dateÉchéance: string;
      }
    | {
        dateÉchéance: string;
      }
  )
>;

export type TypeGarantiesFinancièresEnregistréEventV1 = DomainEvent<
  'TypeGarantiesFinancièresEnregistré-v1',
  {
    identifiantProjet: string;
  } & (
    | {
        typeGarantiesFinancières: `6 mois après achèvement` | 'consignation';
      }
    | {
        typeGarantiesFinancières: `avec date d'échéance`;
        dateÉchéance: string; // legacy
      }
  )
>;

export type AttestationGarantiesFinancièresEnregistréeEvent = DomainEvent<
  'AttestationGarantiesFinancièresEnregistrée',
  {
    identifiantProjet: string;
    format: string;
    date: string;
  }
>;
