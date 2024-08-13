import { PlainType, InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'première-candidature',
  'abandon-classique',
  'abandon-avec-recandidature',
  'lauréat-autre-période',
] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  formatter(): RawType;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
  estValide(type);
  return {
    type,
    estÉgaleÀ: function ({ type }) {
      return this.type === type;
    },
    formatter() {
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
    throw new HistoriqueAbandonInvalideError(value);
  }
}

class HistoriqueAbandonInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type d'historique d'abandon ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
