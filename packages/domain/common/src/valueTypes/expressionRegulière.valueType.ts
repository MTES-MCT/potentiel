import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

export type ValueType = ReadonlyValueType<{
  expression: string;
  valider(value: string): boolean;
  formatter(): string;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);

  return {
    expression: value,
    estÉgaleÀ(valueType) {
      return this.expression === valueType.expression;
    },
    valider(value) {
      return new RegExp(`^${this.expression}$`).test(value);
    },
    formatter() {
      return this.expression;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = !!value;

  if (!isValid) {
    throw new ExpressionRegulièreVideError();
  }
}

export const défaut = convertirEnValueType('(.*)');

class ExpressionRegulièreVideError extends InvalidOperationError {
  constructor() {
    super(`L'expression régulière est vide`);
  }
}
