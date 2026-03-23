import {
  InvalidOperationError,
  OperationRejectedError,
  PlainType,
  ReadonlyValueType,
} from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

export const autoritésCompétentes = ['dreal', 'dgec'] as const;
export const DEFAULT_AUTORITE_COMPETENTE_DELAI: RawType = 'dgec';

export type RawType = (typeof autoritésCompétentes)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  autoritéCompétente: Type;
  formatter(): Type;
  estCompétent(rôle: Role.ValueType): boolean;
  peutInstruire(rôle: Role.ValueType): void;
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
    estCompétent(rôle) {
      // La DGEC peut instruire les demandes dont l'autorité est la DREAL
      if (rôle.estDGEC()) {
        return true;
      }
      if (this.autoritéCompétente === 'dreal' && rôle.estDreal()) {
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
export const dgec = convertirEnValueType<'dgec'>('dgec');

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
