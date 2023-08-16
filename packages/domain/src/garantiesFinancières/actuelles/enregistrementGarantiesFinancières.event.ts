import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../../projet/projet.valueType';

export type TypeGarantiesFinancièresEnregistréSnapshotV1 = DomainEvent<
  'TypeGarantiesFinancièresEnregistréSnapshot-v1',
  {
    identifiantProjet: RawIdentifiantProjet;
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
