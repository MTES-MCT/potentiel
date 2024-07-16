import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statut = ['validées', 'levées', 'échues'] as const;

export type RawType = (typeof statut)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  sontValidées: () => boolean;
  sontLevées: () => boolean;
  sontEchues: () => boolean;
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
    sontValidées() {
      return this.statut === 'validées';
    },
    sontLevées() {
      return this.statut === 'levées';
    },
    sontEchues() {
      return this.statut === 'échues';
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statut.includes(value as RawType);

  if (!isValid) {
    throw new StatutGarantiesFinancièresInvalideError(value);
  }
}

export const validées = convertirEnValueType('validées');
export const levées = convertirEnValueType('levées');

class StatutGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut des garanties financières est inconnu`, {
      value,
    });
  }
}
