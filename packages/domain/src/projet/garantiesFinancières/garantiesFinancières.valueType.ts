import { DateTimeValueType } from '../../common.valueType';
import { Readable } from 'stream';

export type AttestationConstitution = {
  format: string;
  date: DateTimeValueType;
  content: Readable;
};

type TypeGarantiesFinancières =
  | `avec date d'échéance`
  | 'type inconnu'
  | `consignation`
  | `6 mois après achèvement`;

export type TypeEtDateÉchéance = {
  typeGarantiesFinancières: TypeGarantiesFinancières;
  dateÉchéance?: DateTimeValueType;
};

export type GarantiesFinancières = Partial<TypeEtDateÉchéance> & {
  attestationConstitution?: Omit<AttestationConstitution, 'content'>;
};

export const estUnTypeDeGarantiesFinancièresAccepté = (
  value: any,
): value is TypeGarantiesFinancières =>
  value === `avec date d'échéance` ||
  value === 'type inconnu' ||
  value === `consignation` ||
  value === `6 mois après achèvement`;
