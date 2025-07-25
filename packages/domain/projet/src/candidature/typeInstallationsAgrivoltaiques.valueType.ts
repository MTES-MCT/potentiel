import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const types = ['culture', 'jachère-plus-de-5-ans', 'élevage', 'serre'] as const;
export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  formatter(): RawType;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
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

export const convertirEnValueType = (type: string) => {
  estValide(type);
  return bind({ type });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (types as readonly string[]).includes(value);

  if (!isValid) {
    throw new TypeInstallationAgrivoltaiqueInvalideError(value);
  }
}

class TypeInstallationAgrivoltaiqueInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type d'installations agrivoltaïques ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
