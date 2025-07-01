import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = ['culture', 'jachère-plus-de-5-ans', 'élevage', 'serre'] as const;
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
    throw new TypeInstallationAgrivoltaiqueInvalideError(value);
  }
}

class TypeInstallationAgrivoltaiqueInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type d'installation agrivoltaïques ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
