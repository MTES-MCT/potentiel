import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['annulé', 'en-attente-exécution', 'exécuté', 'inconnu'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  statut: Type;
  formatter: () => Type;
  estAnnulé: () => boolean;
  estEnAttenteExécution: () => boolean;
  estExécuté: () => boolean;
}>;

export const convertirEnValueType = <Type extends RawType = RawType>(
  statut: string,
): ValueType<Type> => {
  estValide(statut);
  return {
    get statut() {
      return statut as Type;
    },
    formatter() {
      return this.statut;
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
    estÉgaleÀ({ statut }) {
      return this.statut === statut;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutTâchePlanifiéeInvalideError(value);
  }
}

export const annulée = convertirEnValueType<'annulé'>('annulé');
export const enAttenteExécution =
  convertirEnValueType<'en-attente-exécution'>('en-attente-exécution');
export const exécutée = convertirEnValueType<'exécuté'>('exécuté');
export const inconnu = convertirEnValueType<'inconnu'>('inconnu');

class StatutTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
