import { ReadModel } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type DépôtGarantiesFinancièresReadModelKey =
  `dépôt-garanties-financières|${RawIdentifiantProjet}`;

export type DépôtGarantiesFinancièresReadModel = ReadModel<
  'dépôt-garanties-financières',
  {
    attestationConstitution: { format: string; date: string };
    typeGarantiesFinancières?: `avec date d'échéance` | 'consignation' | `6 mois après achèvement`;
    dateÉchéance?: string;
    dateDépôt: string;
    dateDernièreMiseÀJour: string;
  }
>;

export type FichierDépôtAttestationGarantiesFinancièresReadModel = ReadModel<
  'depot-attestation-constitution-garanties-financieres',
  { format: string; content: ReadableStream }
>;
