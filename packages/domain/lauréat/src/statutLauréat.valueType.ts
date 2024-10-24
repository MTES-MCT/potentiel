import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['abandonné', 'classé'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  formatter(): RawType;
  estClassé(): boolean;
  estAbandonné(): boolean;
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
    estClassé: function () {
      return this.estÉgaleÀ(classé);
    },
    estAbandonné: function () {
      return this.estÉgaleÀ(abandonné);
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

export const abandonné = convertirEnValueType('abandonné');
export const classé = convertirEnValueType('classé');

class StatutCandidatureInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut du lauréat ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
