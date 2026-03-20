import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

// il n'y a plus de nouvelles tâches planifiées à 2 mois, on conserve ce type pour les tâches déjà publiées destinées à être annulées

export const types = [
  'garanties-financières.échoir',
  'garanties-financières.rappel-échéance-un-mois',
  'garanties-financières.rappel-échéance-deux-mois',
  'garanties-financières.rappel-échéance-trois-mois',
  'garanties-financières.rappel-en-attente',
] as const;

export type RawType = (typeof types)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  type: Type;
  formatter: () => Type;
}>;

export const bind = <Type extends RawType = RawType>({
  type,
}: PlainType<ValueType>): ValueType<Type> => {
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
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(type: string) => {
  estValide(type);
  return bind<Type>({
    type,
  });
};

function estValide(value: string): asserts value is RawType {
  const isValid = types.includes(value as RawType);

  if (!isValid) {
    throw new TypeTâchePlanifiéeInvalideError(value);
  }
}

export const échoir = convertirEnValueType<'garanties-financières.échoir'>(
  'garanties-financières.échoir',
);
export const rappelÉchéanceUnMois =
  convertirEnValueType<'garanties-financières.rappel-échéance-un-mois'>(
    'garanties-financières.rappel-échéance-un-mois',
  );
export const rappelÉchéanceDeuxMois =
  convertirEnValueType<'garanties-financières.rappel-échéance-deux-mois'>(
    'garanties-financières.rappel-échéance-deux-mois',
  );
export const rappelÉchéanceTroisMois =
  convertirEnValueType<'garanties-financières.rappel-échéance-trois-mois'>(
    'garanties-financières.rappel-échéance-trois-mois',
  );
export const rappelEnAttente = convertirEnValueType<'garanties-financières.rappel-en-attente'>(
  'garanties-financières.rappel-en-attente',
);

class TypeTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche planifiée ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
