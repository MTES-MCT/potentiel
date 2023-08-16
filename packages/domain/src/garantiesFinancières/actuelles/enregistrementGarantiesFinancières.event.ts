import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../../projet/projet.valueType';

export type TypeGarantiesFinancièresEnregistréEventV1 = DomainEvent<
  'TypeGarantiesFinancièresEnregistré-v1',
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

export type AttestationGarantiesFinancièresEnregistréeEventV1 = DomainEvent<
  'AttestationGarantiesFinancièresEnregistrée-v1',
  {
    identifiantProjet: RawIdentifiantProjet;
    format: string;
    date: string;
  }
>;
