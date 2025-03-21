import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

/**
 * @deprecated use potentiel-domain/projet
 */
export type RawType = 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';

const statuts: Array<RawType> = ['non-notifié', 'abandonné', 'classé', 'éliminé'];

/**
 * @deprecated use potentiel-domain/projet
 */
export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estAbandonné: () => boolean;
  estNonNotifié: () => boolean;
  estClassé: () => boolean;
  estÉliminé: () => boolean;
}>;

/**
 * @deprecated use potentiel-domain/projet
 */
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

/**
 * @deprecated use potentiel-domain/projet
 */
export const abandonné = convertirEnValueType('abandonné');

/**
 * @deprecated use potentiel-domain/projet
 */
export const classé = convertirEnValueType('classé');

/**
 * @deprecated use potentiel-domain/projet
 */
export const nonNotifié = convertirEnValueType('non-notifié');

/**
 * @deprecated use potentiel-domain/projet
 */
export const éliminé = convertirEnValueType('éliminé');

class StatutProjetInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
