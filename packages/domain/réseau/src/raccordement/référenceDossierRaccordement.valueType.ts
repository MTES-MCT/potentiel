import { ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

export type ValueType = ReadonlyValueType<{
  référence: string;
  formatter(): RawType;
}>;
export const convertirEnValueType = (value: string): ValueType => {
  return {
    référence: value,
    estÉgaleÀ({ référence }) {
      return this.référence === référence;
    },
    formatter() {
      return this.référence;
    },
  };
};
