import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statut = ['validé', 'levée'] as const;

export type RawType = (typeof statut)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estValidé: () => boolean;
  estLevée: () => boolean;
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
    estLevée() {
      return this.statut === 'levée';
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
export const levée = convertirEnValueType('levée');

class StatutGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut de la garanties financière est inconnu`, {
      value,
    });
  }
}
