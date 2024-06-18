import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

export type ValueType = ReadonlyValueType<{
  expression: string;
  valider(value: string): boolean;
  formatter(): string;
}>;

export const bind = ({ expression }: PlainType<ValueType>): ValueType => {
  estValide(expression);

  return {
    expression,
    estÉgaleÀ(valueType) {
      return this.expression === valueType.expression;
    },
    valider(value) {
      return new RegExp(`^${this.expression}$`).test(value) || value === 'Référence non transmise';
    },
    formatter() {
      return this.expression;
    },
  };
};

export const convertirEnValueType = (value: string): ValueType => {
  return bind({
    expression: value,
  });
};

function estValide(value: string): asserts value is RawType {
  const isValid = !!value;

  if (!isValid) {
    throw new ExpressionRegulièreVideError();
  }
}

export const accepteTout = convertirEnValueType('(.*)');

class ExpressionRegulièreVideError extends InvalidOperationError {
  constructor() {
    super(`L'expression régulière est vide`);
  }
}
