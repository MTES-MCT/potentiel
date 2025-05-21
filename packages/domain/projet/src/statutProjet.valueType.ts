import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

const statuts = ['abandonné', 'classé', 'éliminé', 'achevé'] as const;
export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estAbandonné: () => boolean;
  estClassé: () => boolean;
  estÉliminé: () => boolean;
  estAchevé: () => boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get statut() {
      return value;
    },
    estAbandonné() {
      return this.statut === 'abandonné';
    },
    estClassé() {
      return this.statut === 'classé';
    },
    estÉliminé() {
      return this.statut === 'éliminé';
    },
    estAchevé() {
      return this.statut === 'achevé';
    },
    estÉgaleÀ(statut: ValueType) {
      return this.statut === statut.statut;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutProjetInvalideError(value);
  }
}

export const abandonné = convertirEnValueType('abandonné');
export const classé = convertirEnValueType('classé');
export const éliminé = convertirEnValueType('éliminé');
export const achevé = convertirEnValueType('achevé');

class StatutProjetInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
