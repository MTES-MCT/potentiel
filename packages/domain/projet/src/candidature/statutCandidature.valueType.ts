import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['éliminé', 'classé'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  statut: Type;
  formatter(): Type;
  estClassé(): boolean;
  estÉliminé(): boolean;
}>;

export const bind = <Type extends RawType = RawType>({
  statut,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(statut);
  return {
    get statut() {
      return statut as Type;
    },
    estÉgaleÀ({ statut }) {
      return this.statut === statut;
    },
    formatter() {
      return this.statut;
    },
    estClassé() {
      return this.statut === 'classé';
    },
    estÉliminé() {
      return this.statut === 'éliminé';
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(statut: string) => {
  estValide(statut);
  return bind<Type>({ statut });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (statuts as readonly string[]).includes(value);

  if (!isValid) {
    throw new StatutCandidatureInvalideError(value);
  }
}

export const éliminé = convertirEnValueType<'éliminé'>('éliminé');
export const classé = convertirEnValueType<'classé'>('classé');

class StatutCandidatureInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut de la candidature ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
