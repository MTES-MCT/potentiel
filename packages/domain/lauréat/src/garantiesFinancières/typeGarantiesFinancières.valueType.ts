import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = ['consignation', "avec date d'échéance", 'six mois après achèvement'] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
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
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = types.includes(value as RawType);

  if (!isValid) {
    throw new TypeGarantiesFinancièresInvalideError(value);
  }
}

export const consignation = convertirEnValueType('consignation');
export const avecDateÉchéance = convertirEnValueType("avec date d'échéance");
export const sixMoisAprèsAchèvement = convertirEnValueType('six mois après achèvement');

class TypeGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
