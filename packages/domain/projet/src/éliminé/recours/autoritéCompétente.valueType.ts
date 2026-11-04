import {
  InvalidOperationError,
  type PlainType,
  type ReadonlyValueType,
} from '@potentiel-domain/core';

export const autoritéCompétente = 'dgec' as const;

export type RawType = typeof autoritéCompétente;

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
  const isValid = autoritéCompétente === value;

  if (!isValid) {
    throw new AutoritéCompétenteInvalideError(value);
  }
}

export const dgec = convertirEnValueType<'dgec'>('dgec');

class AutoritéCompétenteInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'autorité compétente ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
