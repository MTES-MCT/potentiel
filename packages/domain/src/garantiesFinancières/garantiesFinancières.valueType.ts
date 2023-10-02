import { DateTimeValueType } from '../common.valueType';

export type GarantiesFinancières = {
  attestationConstitution?: { format: string; date: DateTimeValueType };
} & (
  | {
      typeGarantiesFinancières?: `avec date d'échéance`;
      dateÉchéance: DateTimeValueType;
    }
  | {
      typeGarantiesFinancières?: `consignation` | `6 mois après achèvement`;
    }
);

export type DépôtGarantiesFinancières = {
  attestationConstitution: { format: string; date: DateTimeValueType };
  dateDépôt: DateTimeValueType;
} & (
  | {
      typeGarantiesFinancières?: `avec date d'échéance`;
      dateÉchéance: DateTimeValueType;
    }
  | {
      typeGarantiesFinancières?: `consignation` | `6 mois après achèvement`;
    }
);
