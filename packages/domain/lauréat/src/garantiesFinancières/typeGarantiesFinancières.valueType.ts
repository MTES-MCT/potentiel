import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = ['consignation', 'avec-date-échéance', 'six-mois-après-achèvement'] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  estConsignation: () => boolean;
  estAvecDateÉchéance: () => boolean;
  estSixMoisAprèsAchèvement: () => boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get type() {
      return value;
    },
    estÉgaleÀ(valueType) {
      return this.type === valueType.type;
    },
    estConsignation() {
      return this.type === 'consignation';
    },
    estAvecDateÉchéance() {
      return this.type === 'avec-date-échéance';
    },
    estSixMoisAprèsAchèvement() {
      return this.type === 'six-mois-après-achèvement';
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = [...types, ''].includes(value as RawType);

  if (!isValid) {
    throw new TypeGarantiesFinancièresInvalideError(value);
  }
}

export const consignation = convertirEnValueType('consignation');
export const avecDateÉchéance = convertirEnValueType('avec-date-échéance');
export const sixMoisAprèsAchèvement = convertirEnValueType('six-mois-après-achèvement');
export const inconnu = convertirEnValueType('');

class TypeGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
