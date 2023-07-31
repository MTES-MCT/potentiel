import { DomainEvent } from '@potentiel/core-domain';

export type TypeGarantiesFinancièresEnregistréEvent = DomainEvent<
  'TypeGarantiesFinancièresEnregistré',
  {
    identifiantProjet: string;
  } & {
    // "type inconnu" pour la migration du legacy (projet sans type et avec date d'échéance)
    typeGarantiesFinancières:
      | `avec date d'échéance`
      | 'consignation'
      | `6 mois après achèvement`
      | `type inconnu`;
    dateÉchéance?: string;
  }
>;

export type AttestationGarantiesFinancièresEnregistréeEvent = DomainEvent<
  'AttestationGarantiesFinancièresEnregistrée',
  {
    identifiantProjet: string;
    format: string;
    date: string;
  }
>;
