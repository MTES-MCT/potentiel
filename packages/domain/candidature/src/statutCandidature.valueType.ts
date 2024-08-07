import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

const statuts = ['éliminé', 'classé'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  formatter(): RawType;
}>;

export const bind = ({ statut }: PlainType<ValueType>): ValueType => {
  estValide(statut);
  return {
    statut,
    estÉgaleÀ: function ({ statut }) {
      return this.statut === statut;
    },
    formatter() {
      return this.statut;
    },
  };
};

export const convertirEnValueType = (value: string) => {
  estValide(value);
  return bind({ statut: value });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (statuts as readonly string[]).includes(value);

  if (!isValid) {
    throw new StatutCandidatureInvalideError(value);
  }
}

export const éliminé = convertirEnValueType('éliminé');
export const classé = convertirEnValueType('classé');

class StatutCandidatureInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut de la candidature ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
