// TODO Ben remove
import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['transmis', 'en-attente', 'non-applicable'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
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
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutPreuveRecandidatureInvalideError(value);
  }
}

export const transmis = convertirEnValueType('transmis');
export const enAttente = convertirEnValueType('en-attente');
export const nonApplicable = convertirEnValueType('non-applicable');

class StatutPreuveRecandidatureInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
