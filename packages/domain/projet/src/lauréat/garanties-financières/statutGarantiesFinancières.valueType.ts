import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const statut = ['non-déposé', 'validé', 'levé', 'échu'] as const;

export type RawType = (typeof statut)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  statut: Type;
  estNonDéposé: () => boolean;
  estValidé: () => boolean;
  estLevé: () => boolean;
  estÉchu: () => boolean;
  formatter(): Type;
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
    estNonDéposé() {
      return this.statut === 'non-déposé';
    },
    estValidé() {
      return this.statut === 'validé';
    },
    estLevé() {
      return this.statut === 'levé';
    },
    estÉchu() {
      return this.statut === 'échu';
    },
    formatter() {
      return this.statut;
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(statut: string) => {
  estValide(statut);
  return bind<Type>({ statut });
};

function estValide(value: string): asserts value is RawType {
  const isValid = statut.includes(value as RawType);

  if (!isValid) {
    throw new StatutGarantiesFinancièresInvalideError(value);
  }
}

export const validé = convertirEnValueType<'validé'>('validé');
export const levé = convertirEnValueType<'levé'>('levé');
export const échu = convertirEnValueType<'échu'>('échu');
export const nonDéposé = convertirEnValueType<'non-déposé'>('non-déposé');

class StatutGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut des garanties financières est inconnu`, {
      value,
    });
  }
}
