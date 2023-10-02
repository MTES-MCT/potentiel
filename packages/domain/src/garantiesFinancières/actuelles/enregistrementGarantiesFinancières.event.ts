import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../../projet/projet.valueType';

export type TypeGarantiesFinancièresImportéEventV1 = DomainEvent<
  'TypeGarantiesFinancièresImporté-v1',
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

export type GarantiesFinancièresEnregistréesEventV1 = DomainEvent<
  'GarantiesFinancièresEnregistrées-v1',
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
