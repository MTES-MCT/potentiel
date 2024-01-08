import { ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

export type ValueType = ReadonlyValueType<{
  expression: string;
  valider(value: string): boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  const expression = !value ? '(.*)' : value;

  return {
    expression,
    estÉgaleÀ(valueType) {
      return this.expression === valueType.expression;
    },
    valider(value) {
      return new RegExp(`^${expression}$`).test(value);
    },
  };
};
