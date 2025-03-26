import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = ['pv', 'eolien', 'hydraulique', 'N/A'] as const;
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
    throw new TypeTechnologieInvalideError(value);
  }
}

export const photovoltaïque = convertirEnValueType('pv');
export const éolien = convertirEnValueType('eolien');
export const hydraulique = convertirEnValueType('hydraulique');
export const nonApplicable = convertirEnValueType('N/A');

class TypeTechnologieInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de la technologie ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
