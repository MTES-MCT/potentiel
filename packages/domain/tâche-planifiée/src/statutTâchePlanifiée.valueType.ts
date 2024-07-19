import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['annulée', 'en-attente-exécution', 'exécutée', 'inconnu'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estAnnulée: () => boolean;
  estEnAttenteExécution: () => boolean;
  estExécutée: () => boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get statut() {
      return value;
    },
    estAnnulée() {
      return this.statut === 'annulée';
    },
    estEnAttenteExécution() {
      return this.statut === 'en-attente-exécution';
    },
    estExécutée() {
      return this.statut === 'exécutée';
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutTâchePlanifiéeInvalideError(value);
  }
}

export const annulée = convertirEnValueType('annulée');
export const enAttenteExécution = convertirEnValueType('en-attente-exécution');
export const exécutée = convertirEnValueType('exécutée');
export const inconnu = convertirEnValueType('inconnu');

class StatutTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
