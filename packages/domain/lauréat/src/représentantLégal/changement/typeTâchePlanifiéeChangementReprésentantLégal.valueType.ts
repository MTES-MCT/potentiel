import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

const type = 'représentant-légal.changement-accord-ou-rejet-tacite' as const;

export type RawType = (typeof type)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  estChangementRéputéAccordé: () => boolean;
  estChangementRéputéRejeté: () => boolean;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
  return {
    type,
    estÉgaleÀ({ type }) {
      return this.type === type;
    },
    estChangementRéputéAccordé() {
      return this.type === 'accord-tacite';
    },
    estChangementRéputéRejeté() {
      return this.type === 'rejet-tacite';
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
  const isValid = type.includes(value as RawType);

  if (!isValid) {
    throw new TypeTâchePlanifiéeInvalideError(value);
  }
}

export const changementAccordOuRejetTacite = convertirEnValueType(
  'représentant-légal.changement-accord-ou-rejet-tacite',
);

class TypeTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche planifiée ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
