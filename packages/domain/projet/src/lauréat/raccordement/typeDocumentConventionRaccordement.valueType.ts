import {
  InvalidOperationError,
  type PlainType,
  type ReadonlyValueType,
} from '@potentiel-domain/core';

export const type = [
  'proposition-technique-et-financière',
  'convention-de-raccordement',
  'convention-directe-de-raccordement',
] as const;

export type RawType = (typeof type)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  type: Type;
  formatter: () => Type;
  estPropositionTechniqueEtFinancière: () => boolean;
  estConventionDeRaccordement: () => boolean;
  estConventionDirecteDeRaccordement: () => boolean;
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
    estÉgaleÀ({ type }) {
      return this.type === type;
    },
    estPropositionTechniqueEtFinancière() {
      return this.type === 'proposition-technique-et-financière';
    },
    estConventionDeRaccordement() {
      return this.type === 'convention-de-raccordement';
    },
    estConventionDirecteDeRaccordement() {
      return this.type === 'convention-directe-de-raccordement';
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(type: string) => {
  estValide(type);
  return bind<Type>({ type });
};

function estValide(value: string): asserts value is RawType {
  const isValid = type.includes(value as RawType);

  if (!isValid) {
    throw new TypeDocumentConventionRaccordementError(value);
  }
}

export const propositionTechniqueEtFinancière =
  convertirEnValueType<'proposition-technique-et-financière'>(
    'proposition-technique-et-financière',
  );
export const conventionDeRaccordement = convertirEnValueType<'convention-de-raccordement'>(
  'convention-de-raccordement',
);
export const conventionDirecteDeRaccordement =
  convertirEnValueType<'convention-directe-de-raccordement'>('convention-directe-de-raccordement');

class TypeDocumentConventionRaccordementError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de document est inconnu`, {
      value,
    });
  }
}
