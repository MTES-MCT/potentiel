import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = ['inconnu', 'abandon.confirmer', 'abandon.transmettre-preuve-recandidature'];

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    type: value,
    estÉgaleÀ: function ({ type }) {
      return this.type === type;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = (types as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeTâcheInvalideError(value);
  }
}

export const inconnue = convertirEnValueType('inconnue');
export const abandonConfirmer = convertirEnValueType('abandon.confirmer');
export const abandonTransmettrePreuveRecandidature = convertirEnValueType(
  'abandon.transmettre-preuve-recandidature',
);

class TypeTâcheInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
