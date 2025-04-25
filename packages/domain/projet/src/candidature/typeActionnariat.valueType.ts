import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const ppe2Types = ['financement-collectif', 'gouvernance-partagée'] as const;
export const cre4Types = ['financement-participatif', 'investissement-participatif'] as const;
export const types = [...ppe2Types, ...cre4Types] as const;
export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  formatter(): RawType;
  estFinancementCollectif(): boolean;
  estGouvernancePartagée(): boolean;
  estFinancementParticipatif(): boolean;
  estInvestissementParticipatif(): boolean;
}>;

export const convertirEnValueType = (type: string) => {
  estValide(type);
  return {
    type,
    formatter() {
      return this.type;
    },
    estÉgaleÀ(type: ValueType) {
      return this.type === type.type;
    },
    estFinancementCollectif() {
      return this.estÉgaleÀ(financementCollectif);
    },
    estGouvernancePartagée() {
      return this.estÉgaleÀ(gouvernancePartagée);
    },
    estFinancementParticipatif() {
      return this.estÉgaleÀ(financementParticipatif);
    },
    estInvestissementParticipatif() {
      return this.estÉgaleÀ(investissementParticipatif);
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = (types as readonly string[]).includes(value);

  if (!isValid) {
    throw new TypeActionnariatInvalideError(value);
  }
}

export const financementCollectif = convertirEnValueType('financement-collectif');
export const gouvernancePartagée = convertirEnValueType('gouvernance-partagée');
export const financementParticipatif = convertirEnValueType('financement-participatif');
export const investissementParticipatif = convertirEnValueType('investissement-participatif');

class TypeActionnariatInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type d'actionnariat ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
