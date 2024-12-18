import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

const types = [
  'représentant-légal.changement-réputé-accordé',
  'représentant-légal.changement-réputé-rejeté',
] as const;

export type RawType = (typeof types)[number];

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
      return this.type === 'représentant-légal.changement-réputé-accordé';
    },
    estChangementRéputéRejeté() {
      return this.type === 'représentant-légal.changement-réputé-rejeté';
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

export const changementRéputéAccordé = convertirEnValueType(
  'représentant-légal.changement-réputé-accordé',
);
export const changementRéputéRejeté = convertirEnValueType(
  'représentant-légal.changement-réputé-rejeté',
);

class TypeTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche planifiée ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
