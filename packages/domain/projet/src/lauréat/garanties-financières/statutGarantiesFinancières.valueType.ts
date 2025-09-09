import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statut = ['validé', 'levé', 'échu'] as const;

export type RawType = (typeof statut)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estValidé: () => boolean;
  estLevé: () => boolean;
  estÉchu: () => boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get statut() {
      return value;
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    estValidé() {
      return this.statut === 'validé';
    },
    estLevé() {
      return this.statut === 'levé';
    },
    estÉchu() {
      return this.statut === 'échu';
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statut.includes(value as RawType);

  if (!isValid) {
    throw new StatutGarantiesFinancièresInvalideError(value);
  }
}

export const validé = convertirEnValueType('validé');
export const levé = convertirEnValueType('levé');
export const échu = convertirEnValueType('échu');

class StatutGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut des garanties financières est inconnu`, {
      value,
    });
  }
}
