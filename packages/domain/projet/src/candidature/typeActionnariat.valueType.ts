import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const ppe2Types = [
  'financement-collectif',
  'gouvernance-partagée',
  'financement-collectif-et-gouvernance-partagée',
] as const;
export const cre4Types = ['financement-participatif', 'investissement-participatif'] as const;
export const types = [...ppe2Types, ...cre4Types] as const;
export type RawType = (typeof types)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  type: Type;
  formatter(): Type;
  estFinancementCollectif(): boolean;
  estGouvernancePartagée(): boolean;
  estFinancementParticipatif(): boolean;
  estInvestissementParticipatif(): boolean;
}>;

export const bind = <Type extends RawType = RawType>({
  type,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(type);
  return {
    get type() {
      return type as Type;
    },
    formatter() {
      return this.type;
    },
    estÉgaleÀ(type: ValueType) {
      return this.type === type.type;
    },
    estFinancementCollectif() {
      return (
        this.type === 'financement-collectif' ||
        this.type === 'financement-collectif-et-gouvernance-partagée'
      );
    },
    estGouvernancePartagée() {
      return (
        this.type === 'gouvernance-partagée' ||
        this.type === 'financement-collectif-et-gouvernance-partagée'
      );
    },
    estFinancementParticipatif() {
      return this.type === 'financement-participatif';
    },
    estInvestissementParticipatif() {
      return this.type === 'investissement-participatif';
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
    throw new TypeActionnariatInvalideError(value);
  }
}

export const financementCollectif =
  convertirEnValueType<'financement-collectif'>('financement-collectif');
export const gouvernancePartagée =
  convertirEnValueType<'gouvernance-partagée'>('gouvernance-partagée');
export const financementCollectifEtGouvernancePartagée =
  convertirEnValueType<'financement-collectif-et-gouvernance-partagée'>(
    'financement-collectif-et-gouvernance-partagée',
  );
export const financementParticipatif = convertirEnValueType<'financement-participatif'>(
  'financement-participatif',
);
export const investissementParticipatif = convertirEnValueType<'investissement-participatif'>(
  'investissement-participatif',
);

class TypeActionnariatInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type d'actionnariat ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
