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
        dateÉchéance: string;
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

export type GarantiesFinancièresComplètesEnregistréesEventV1 = DomainEvent<
  'GarantiesFinancièresComplètesEnregistréesEvent-v1',
  {
    identifiantProjet: RawIdentifiantProjet;
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
