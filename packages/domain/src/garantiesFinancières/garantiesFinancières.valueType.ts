import { DateTimeValueType } from '../common.valueType';

export type AttestationConstitution = {
  format: string;
  date: DateTimeValueType;
  content: ReadableStream;
};

export type TypeGarantiesFinancières =
  | `avec date d'échéance`
  | `consignation`
  | `6 mois après achèvement`;

export type TypeEtDateÉchéance = {
  typeGarantiesFinancières: `avec date d'échéance` | `consignation` | `6 mois après achèvement`;
  dateÉchéance?: DateTimeValueType;
};

export type GarantiesFinancières = Partial<TypeEtDateÉchéance> & {
  attestationConstitution?: Omit<AttestationConstitution, 'content'>;
};

export type DépôtGarantiesFinancières = Partial<TypeEtDateÉchéance> & {
  attestationConstitution: Omit<AttestationConstitution, 'content'>;
  dateDépôt: DateTimeValueType;
};

export const estUnTypeDeGarantiesFinancièresAccepté = (
  value: any,
): value is TypeGarantiesFinancières =>
  value === `avec date d'échéance` ||
  value === `consignation` ||
  value === `6 mois après achèvement`;

export const estTypeAvecDateÉchéance = (value: any): value is TypeGarantiesFinancières =>
  value === `avec date d'échéance`;
