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
    région: RégionFrançaise[];
    identifiantProjet: RawIdentifiantProjet;
  }
>;

export type FichierDépôtAttestationGarantiesFinancièresReadModel = ReadModel<
  'depot-attestation-constitution-garanties-financieres',
  { format: string; content: ReadableStream }
>;

export const RÉGIONS_FRANCAISES = [
  'Grand Est',
  'Occitanie',
  "Provence-Alpes-Côte d'Azur",
  'Normandie',
  'Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine',
  'Centre-Val de Loire',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Pays de la Loire',
  'Hauts-de-France',
  'Île-de-France',
  'Guadeloupe',
  'Martinique',
  'Guyane',
  'La Réunion',
  'Mayotte',
  'Corse',
] as const;

export type RégionFrançaise = (typeof RÉGIONS_FRANCAISES)[number];

export const isRégionFrançaise = (value: any): value is RégionFrançaise =>
  RÉGIONS_FRANCAISES.includes(value);
