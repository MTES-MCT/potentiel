import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

const types = [
  // 'garanties-financières.inconnue',
  'garanties-financières.échoir',
  'garanties-financières.rappel-échéance-un-mois',
  'garanties-financières.rappel-échéance-deux-mois',
] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  // estInconnu: () => boolean;
  estÉchoir: () => boolean;
  estRappelÉchéanceUnMois: () => boolean;
  estRappelÉchéanceDeuxMois: () => boolean;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
  return {
    type,
    estÉgaleÀ({ type }) {
      return this.type === type;
    },
    // estInconnu() {
    //   return this.type === 'garanties-financières.inconnue';
    // },
    estÉchoir() {
      return this.type === 'garanties-financières.échoir';
    },
    estRappelÉchéanceUnMois() {
      return this.type === 'garanties-financières.rappel-échéance-un-mois';
    },
    estRappelÉchéanceDeuxMois() {
      return this.type === 'garanties-financières.rappel-échéance-deux-mois';
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

// export const inconnue = convertirEnValueType('garanties-financières.inconnue');
export const échoir = convertirEnValueType('garanties-financières.échoir');
export const rappelÉchéanceUnMois = convertirEnValueType(
  'garanties-financières.rappel-échéance-un-mois',
);
export const rappelÉchéanceDeuxMois = convertirEnValueType(
  'garanties-financières.rappel-échéance-deux-mois',
);

class TypeTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche planifiée ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
