import {
  InvalidOperationError,
  OperationRejectedError,
  PlainType,
  ReadonlyValueType,
} from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

export const autoritésCompétentes = ['dreal', 'dgec'] as const;

export type RawType = (typeof autoritésCompétentes)[number];

export type ValueType = ReadonlyValueType<{
  autoritéCompétente: RawType;
  formatter(): RawType;
  estCompétent(rôle: Role.ValueType): boolean;
  peutInstruire(rôle: Role.ValueType): void;
}>;

export const bind = ({ autoritéCompétente }: PlainType<ValueType>): ValueType => {
  return {
    get autoritéCompétente() {
      return autoritéCompétente;
    },
    estÉgaleÀ(valueType) {
      return this.autoritéCompétente === valueType.autoritéCompétente;
    },
    formatter() {
      return this.autoritéCompétente;
    },
    estCompétent(rôle) {
      // La DGEC peut instruire les demandes dont l'autorité est la DREAL
      if (rôle.estDGEC()) {
        return true;
      }
      if (this.estÉgaleÀ(dreal) && rôle.estDreal()) {
        return true;
      }
      return false;
    },
    peutInstruire(rôle) {
      if (!this.estCompétent(rôle)) {
        throw new RôleNonAutoriséError();
      }
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

export const dreal = convertirEnValueType('dreal');
export const dgec = convertirEnValueType('dgec');

class AutoritéCompétenteInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'autorité compétente ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class RôleNonAutoriséError extends OperationRejectedError {
  constructor() {
    super(`Vous n'avez pas le rôle requis pour instruire cette demande`);
  }
}
