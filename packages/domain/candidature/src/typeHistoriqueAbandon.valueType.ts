import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

const types = [
  'lauréat_aucun_ao',
  'abandon_classique',
  'abandon_avec_recandidature',
  'lauréat_ao',
] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  formatter(): RawType;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
  return {
    type,
    estÉgaleÀ: function ({ type }) {
      return this.type === type;
    },
    formatter: function () {
      return this.type;
    },
  };
};
export const convertirEnValueType = (value: string) => {
  estValide(value);
  return bind({ type: value });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (types as readonly string[]).includes(value);

  if (!isValid) {
    throw new TypeHistoriqueAbandonInvalideError(value);
  }
}

export const lauréatAvecAO = convertirEnValueType('lauréat_ao');
export const lauréatSansAO = convertirEnValueType('lauréat_aucun_ao');
export const abandonClassique = convertirEnValueType('abandon_classique');
export const abandonAvecRecandidature = convertirEnValueType('abandon_avec_recandidature');

class TypeHistoriqueAbandonInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type d'historique d'abandon ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
