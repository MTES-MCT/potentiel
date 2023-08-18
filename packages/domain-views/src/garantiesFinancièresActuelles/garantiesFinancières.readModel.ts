import { ReadModel } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type GarantiesFinancièresReadModelKey = `garanties-financières|${RawIdentifiantProjet}`;

export type GarantiesFinancièresReadModel = ReadModel<
  'garanties-financières',
  {
    attestationConstitution?: { format: string; date: string };
    typeGarantiesFinancières?: `avec date d'échéance` | 'consignation' | `6 mois après achèvement`;
    dateÉchéance?: string;
  }
>;

export type FichierAttestationGarantiesFinancièresReadModel = ReadModel<
  'attestation-constitution-garanties-financieres',
  { format: string; content: ReadableStream }
>;

export { ConsulterGarantiesFinancièresReadModel } from './consulter/consulterGarantiesFinancières.query';
