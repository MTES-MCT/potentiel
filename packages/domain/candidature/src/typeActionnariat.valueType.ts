import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  // PPE2
  'financement-collectif',
  'gouvernance-partagée',
  // CRE4
  'financement-participatif',
  'investissement-participatif',
] as const;
export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  formatter(): RawType;
}>;

export const convertirEnValueType = (type: string) => {
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
    throw new TypeActionnariatInvalideError(value);
  }
}

export const financementCollectif = convertirEnValueType('financement-collectif');
export const gouvernancePartagée = convertirEnValueType('gouvernance-partagée');

class TypeActionnariatInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type d'actionnariat ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
