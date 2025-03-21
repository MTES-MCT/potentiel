import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';

const statuts: Array<RawType> = ['non-notifié', 'abandonné', 'classé', 'éliminé'];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estAbandonné: () => boolean;
  estNonNotifié: () => boolean;
  estClassé: () => boolean;
  estÉliminé: () => boolean;
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
    estNonNotifié() {
      return this.statut === 'non-notifié';
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
    throw new StatutProjetInvalideError(value);
  }
}

export const abandonné = convertirEnValueType('abandonné');
export const classé = convertirEnValueType('classé');
export const nonNotifié = convertirEnValueType('non-notifié');
export const éliminé = convertirEnValueType('éliminé');

class StatutProjetInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
