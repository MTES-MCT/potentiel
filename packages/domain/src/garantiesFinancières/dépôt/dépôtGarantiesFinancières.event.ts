import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../../projet/projet.valueType';

export type GarantiesFinancièresDéposéesSnapshot = DomainEvent<
  'GarantiesFinancièresDéposéesSnapshot', // legacy
  {
    identifiantProjet: RawIdentifiantProjet;
    dateÉchéance?: string;
    typeGarantiesFinancières?: `6 mois après achèvement` | 'consignation' | `avec date d'échéance`;
    attestationConstitution: { format: string; date: string };
    dateDépôt: string;
  }
>;

export type GarantiesFinancièresDéposéesEvent = DomainEvent<
  'GarantiesFinancièresDéposées',
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

export type DépôtGarantiesFinancièresModifiéEvent = DomainEvent<
  'DépôtGarantiesFinancièresModifié',
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
