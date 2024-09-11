import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = 'classé' | 'éliminé';

const statuts: Array<RawType> = ['classé', 'éliminé'];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estClassé: () => boolean;
  estÉliminé: () => boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get statut() {
      return value;
    },
    estClassé() {
      return this.statut === 'classé';
    },
    estÉliminé() {
      return this.statut === 'éliminé';
    },
    estÉgaleÀ(statut: ValueType) {
      return this.statut === statut.statut;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = (statuts as Array<string>).includes(value);

  if (!isValid) {
    throw new StatutCandidatureInvalideError(value);
  }
}

export const classé = convertirEnValueType('classé');
export const éliminé = convertirEnValueType('éliminé');

class StatutCandidatureInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
