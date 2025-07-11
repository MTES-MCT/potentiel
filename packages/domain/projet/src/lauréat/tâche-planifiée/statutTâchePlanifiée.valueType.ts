import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['annulé', 'en-attente-exécution', 'exécuté', 'inconnu'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estAnnulé: () => boolean;
  estEnAttenteExécution: () => boolean;
  estExécuté: () => boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get statut() {
      return value;
    },
    estAnnulé() {
      return this.statut === 'annulé';
    },
    estEnAttenteExécution() {
      return this.statut === 'en-attente-exécution';
    },
    estExécuté() {
      return this.statut === 'exécuté';
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

export const annulée = convertirEnValueType('annulé');
export const enAttenteExécution = convertirEnValueType('en-attente-exécution');
export const exécutée = convertirEnValueType('exécuté');
export const inconnu = convertirEnValueType('inconnu');

class StatutTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
