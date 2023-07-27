import { ReadModel } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type GarantiesFinancièresReadModelKey = `garanties-financières#${RawIdentifiantProjet}`;

export type GarantiesFinancièresReadModel = ReadModel<
  'garanties-financières',
  {
    attestationConstitution?: { format: string; date: string };
    typeGarantiesFinancières?:
      | `avec date d'échéance`
      | 'consignation'
      | `6 mois après achèvement`
      | 'type inconnu';
    dateÉchéance?: string;
  }
>;

export { ConsulterGarantiesFinancièresReadModel } from './consulter/consulterGarantiesFinancières.query';
