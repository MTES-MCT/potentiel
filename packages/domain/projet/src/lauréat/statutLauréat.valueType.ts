import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['abandonné', 'actif', 'achevé'] as const;
export type RawType = (typeof statuts)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  statut: Type;
  estAbandonné: () => this is ValueType<'abandonné'>;
  estActif: () => this is ValueType<'actif'>;
  estAchevé: () => this is ValueType<'achevé'>;
  formatter: () => Type;
}>;

export const bind = <Type extends RawType = RawType>({
  statut,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(statut);
  return {
    get statut() {
      return statut as Type;
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    estAbandonné(): this is ValueType<'abandonné'> {
      return this.statut === 'abandonné';
    },
    estActif(): this is ValueType<'actif'> {
      return this.statut === 'actif';
    },
    estAchevé(): this is ValueType<'achevé'> {
      return this.statut === 'achevé';
    },
    formatter() {
      return this.statut;
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(
  statut: string,
): ValueType<Type> => {
  estValide(statut);
  return bind<Type>({ statut });
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutProjetInvalideError(value);
  }
}

export const abandonné = convertirEnValueType<'abandonné'>('abandonné');
export const actif = convertirEnValueType<'actif'>('actif');
export const achevé = convertirEnValueType<'achevé'>('achevé');

class StatutProjetInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
