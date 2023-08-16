import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../../projet/projet.valueType';

export type TypeGarantiesFinancièresEnregistréEvent = DomainEvent<
  'TypeGarantiesFinancièresEnregistré',
  {
    identifiantProjet: RawIdentifiantProjet;
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
    identifiantProjet: RawIdentifiantProjet;
    format: string;
    date: string;
  }
>;
