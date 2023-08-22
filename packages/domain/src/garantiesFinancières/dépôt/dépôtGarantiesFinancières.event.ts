import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../../projet/projet.valueType';

export type GarantiesFinancièresDéposéesEventV1 = DomainEvent<
  'GarantiesFinancièresDéposées-v1',
  {
    identifiantProjet: RawIdentifiantProjet;
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

export type DépôtGarantiesFinancièresValidéEventV1 = DomainEvent<
  'DépôtGarantiesFinancièresValidé-v1',
  {
    identifiantProjet: RawIdentifiantProjet;
  }
>;

export type DépôtGarantiesFinancièresSuppriméEventV1 = DomainEvent<
  'DépôtGarantiesFinancièresSupprimé-v1',
  {
    identifiantProjet: RawIdentifiantProjet;
  }
>;
