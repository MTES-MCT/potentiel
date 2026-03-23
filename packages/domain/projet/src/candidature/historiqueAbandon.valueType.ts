import { PlainType, InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'première-candidature',
  'abandon-classique',
  'abandon-avec-recandidature',
  'lauréat-autre-période',
] as const;

export type RawType = (typeof types)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  type: Type;
  formatter(): Type;
}>;

export const bind = <Type extends RawType = RawType>({
  type,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(type);
  return {
    get type() {
      return type as Type;
    },
    estÉgaleÀ({ type }) {
      return this.type === type;
    },
    formatter() {
      return this.type;
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(type: string) => {
  estValide(type);
  return bind<Type>({ type });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (types as readonly string[]).includes(value);

  if (!isValid) {
    throw new HistoriqueAbandonInvalideError(value);
  }
}

export const premièreCandidature =
  convertirEnValueType<'première-candidature'>('première-candidature');
export const abandonClassique = convertirEnValueType<'abandon-classique'>('abandon-classique');
export const abandonAvecRecandidature = convertirEnValueType<'abandon-avec-recandidature'>(
  'abandon-avec-recandidature',
);
export const lauréatAutrePériode =
  convertirEnValueType<'lauréat-autre-période'>('lauréat-autre-période');

class HistoriqueAbandonInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type d'historique d'abandon ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
