import {
  InvalidOperationError,
  type PlainType,
  type ReadonlyValueType,
} from '@potentiel-domain/core';

// La dgec pouvait instruire certaines demandes jusqu'à octobre 2025
export const autoritésCompétentes = ['dreal', 'dgec'] as const;
export type RawType = (typeof autoritésCompétentes)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  autoritéCompétente: Type;
  formatter(): Type;
}>;

export const bind = <Type extends RawType = RawType>({
  autoritéCompétente,
}: PlainType<ValueType>): ValueType<Type> => {
  return {
    get autoritéCompétente() {
      return autoritéCompétente as Type;
    },
    estÉgaleÀ(valueType) {
      return this.autoritéCompétente === valueType.autoritéCompétente;
    },
    formatter() {
      return this.autoritéCompétente;
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(value: string) => {
  estValide(value);
  return bind<Type>({ autoritéCompétente: value });
};

function estValide(value: string): asserts value is RawType {
  const isValid = autoritésCompétentes.includes(value as RawType);

  if (!isValid) {
    throw new AutoritéCompétenteInvalideError(value);
  }
}

export const dreal = convertirEnValueType<'dreal'>('dreal');

class AutoritéCompétenteInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'autorité compétente ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
