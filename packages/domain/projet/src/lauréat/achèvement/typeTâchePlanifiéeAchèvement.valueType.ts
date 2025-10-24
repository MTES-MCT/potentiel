import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'achèvement.rappel-échéance-un-mois',
  'achèvement.rappel-échéance-deux-mois',
  'achèvement.rappel-échéance-trois-mois',
] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
  return {
    type,
    estÉgaleÀ({ type }) {
      return this.type === type;
    },
  };
};

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return bind({
    type: value,
  });
};

function estValide(value: string): asserts value is RawType {
  const isValid = types.includes(value as RawType);

  if (!isValid) {
    throw new TypeTâchePlanifiéeInvalideError(value);
  }
}

export const rappelÉchéanceUnMois = convertirEnValueType('achèvement.rappel-échéance-un-mois');
export const rappelÉchéanceDeuxMois = convertirEnValueType('achèvement.rappel-échéance-deux-mois');
export const rappelÉchéanceTroisMois = convertirEnValueType(
  'achèvement.rappel-échéance-trois-mois',
);

class TypeTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche planifiée ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
