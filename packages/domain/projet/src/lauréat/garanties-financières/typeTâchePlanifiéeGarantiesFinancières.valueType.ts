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

export const échoir = convertirEnValueType('garanties-financières.échoir');
export const rappelÉchéanceUnMois = convertirEnValueType(
  'garanties-financières.rappel-échéance-un-mois',
);
export const rappelÉchéanceDeuxMois = convertirEnValueType(
  'garanties-financières.rappel-échéance-deux-mois',
);
export const rappelÉchéanceTroisMois = convertirEnValueType(
  'garanties-financières.rappel-échéance-trois-mois',
);
export const rappelEnAttente = convertirEnValueType('garanties-financières.rappel-en-attente');

class TypeTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche planifiée ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
