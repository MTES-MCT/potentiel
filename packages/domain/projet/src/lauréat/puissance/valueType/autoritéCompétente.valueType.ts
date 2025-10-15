import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const autoritésCompétentes = ['dreal', 'dgec-admin'] as const;

export type RawType = (typeof autoritésCompétentes)[number];

export type ValueType = ReadonlyValueType<{
  autoritéCompétente: RawType;
}>;

export const bind = ({ autoritéCompétente }: PlainType<ValueType>): ValueType => {
  return {
    get autoritéCompétente() {
      return autoritéCompétente;
    },
    estÉgaleÀ(valueType) {
      return this.autoritéCompétente === valueType.autoritéCompétente;
    },
  };
};

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return bind({ autoritéCompétente: value });
};

function estValide(value: string): asserts value is RawType {
  const isValid = autoritésCompétentes.includes(value as RawType);

  if (!isValid) {
    throw new AutoritéCompétenteInvalideError(value);
  }
}

export const déterminer = (): ValueType => convertirEnValueType('dreal');
// ancienne règle valable jusqu'à octobre 2025
// ratio < 1 ? convertirEnValueType('dreal') : convertirEnValueType('dgec-admin');

class AutoritéCompétenteInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'autorité compétente ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
