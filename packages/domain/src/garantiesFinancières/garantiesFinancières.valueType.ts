import { DateTimeValueType } from '../common.valueType';

export type GarantiesFinancières = {
  typeGarantiesFinancières?: `avec date d'échéance` | `consignation` | `6 mois après achèvement`;
  dateÉchéance?: DateTimeValueType;
  attestationConstitution?: { format: string; date: DateTimeValueType };
};

export type DépôtGarantiesFinancières = {
  typeGarantiesFinancières?: `avec date d'échéance` | `consignation` | `6 mois après achèvement`;
  dateÉchéance?: DateTimeValueType;
  attestationConstitution: { format: string; date: DateTimeValueType };
  dateDépôt: DateTimeValueType;
};
