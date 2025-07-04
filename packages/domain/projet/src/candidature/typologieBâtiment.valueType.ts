import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'neuf',
  'existant-avec-rénovation-de-toiture',
  'existant-sans-rénovation-de-toiture',
  'mixte',
] as const;
export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  formatter(): RawType;
}>;

export const convertirEnValueType = (type: string): ValueType => {
  estValide(type);
  return {
    type,
    formatter() {
      return this.type;
    },
    estÉgaleÀ(type: ValueType) {
      return this.type === type.type;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = (types as readonly string[]).includes(value);

  if (!isValid) {
    throw new TypologieBâtimentInvalideError(value);
  }
}

class TypologieBâtimentInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`La typologie de bâtiment ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
