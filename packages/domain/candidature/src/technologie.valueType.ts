import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeTechnologie = 'pv' | 'eolien' | 'hydraulique' | 'N/A';

export type RawType = string;

const typeDocument: Array<TypeTechnologie> = ['pv', 'eolien', 'hydraulique', 'N/A'];

export type ValueType = Readonly<{
  type: TypeTechnologie;
  formatter(): RawType;
}>;

export const convertirEnValueType = (type: string) => {
  estValide(type);
  return {
    type,
    formatter() {
      return this.type;
    },
  };
};

function estValide(value: string): asserts value is TypeTechnologie {
  const isValid = (typeDocument as Array<string>).includes(value);

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
