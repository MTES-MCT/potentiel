import {
  InvalidOperationError,
  OperationRejectedError,
  PlainType,
  ReadonlyValueType,
} from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

export const autoritésInstructrices = ['dreal', 'dgec'] as const;
export const DEFAULT_AUTORITE_INSTRUCTRICE_ABANDON: RawType = 'dgec';

export type RawType = (typeof autoritésInstructrices)[number];

export type ValueType = ReadonlyValueType<{
  autoritéInstructrice: RawType;
  formatter(): RawType;
  estCompétent(rôle: Role.ValueType): boolean;
  peutInstruire(rôle: Role.ValueType): void;
}>;

export const bind = ({ autoritéInstructrice }: PlainType<ValueType>): ValueType => {
  return {
    get autoritéInstructrice() {
      return autoritéInstructrice;
    },
    estÉgaleÀ(valueType) {
      return this.autoritéInstructrice === valueType.autoritéInstructrice;
    },
    formatter() {
      return this.autoritéInstructrice;
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
  return bind({ autoritéInstructrice: value });
};

function estValide(value: string): asserts value is RawType {
  const isValid = autoritésInstructrices.includes(value as RawType);

  if (!isValid) {
    throw new AutoritéInstructriceInvalideError(value);
  }
}

export const dreal = convertirEnValueType('dreal');
export const dgec = convertirEnValueType('dgec');

class AutoritéInstructriceInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'autorité Instructrice ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class RôleNonAutoriséError extends OperationRejectedError {
  constructor() {
    super(`Vous n'avez pas le rôle requis pour instruire cette demande`);
  }
}
