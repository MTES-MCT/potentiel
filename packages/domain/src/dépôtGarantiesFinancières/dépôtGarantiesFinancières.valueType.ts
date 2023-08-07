import {
  AttestationConstitution,
  DateTimeValueType,
  TypeEtDateÉchéance,
} from '../domain.valueType';

export type DépôtGarantiesFinancières = Partial<TypeEtDateÉchéance> & {
  attestationConstitution: Omit<AttestationConstitution, 'content'>;
  dateDépôt: DateTimeValueType;
};
