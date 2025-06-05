import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const types = ['pv', 'eolien', 'hydraulique', 'N/A'] as const;
export type RawType = (typeof types)[number];

export type ValueType<T extends RawType = RawType> = ReadonlyValueType<{
  type: T;
  formatter(): T;
  estNonApplicable(): boolean;
}>;

export const bind = <T extends RawType = RawType>({ type }: PlainType<ValueType>): ValueType<T> => {
  estValide(type);
  return {
    type: type as T,
    formatter() {
      return this.type as T;
    },
    estÉgaleÀ(type: ValueType) {
      return this.type === type.type;
    },
    estNonApplicable() {
      return (this as ValueType).estÉgaleÀ(nonApplicable);
    },
  };
};

export const convertirEnValueType = <T extends RawType = RawType>(type: string): ValueType<T> => {
  estValide(type);
  return bind({ type });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (types as readonly string[]).includes(value);

  if (!isValid) {
    throw new TypeTechnologieInvalideError(value);
  }
}

export const photovoltaïque = convertirEnValueType<'pv'>('pv');
export const éolien = convertirEnValueType<'eolien'>('eolien');
export const hydraulique = convertirEnValueType<'hydraulique'>('hydraulique');
export const nonApplicable = convertirEnValueType<'N/A'>('N/A');

class TypeTechnologieInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de la technologie ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
