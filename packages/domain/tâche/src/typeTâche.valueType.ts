import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'inconnue',
  'abandon.confirmer',
  'abandon.transmettre-preuve-recandidature',
  'raccordement.référence-non-transmise',
  'garanties-financières.demander',
];

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
export const raccordementRéférenceNonTransmise = convertirEnValueType(
  'raccordement.référence-non-transmise',
);

export const garantiesFinancieresDemander = convertirEnValueType('garanties-financières.demander');

class TypeTâcheInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
