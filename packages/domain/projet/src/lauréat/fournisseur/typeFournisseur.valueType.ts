import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const typesFournisseurPV = [
  'module-ou-films',
  'cellules',
  'plaquettes-silicium',
  'polysilicium',
  'postes-conversion',
  'structure',
  'dispositifs-stockage-energie',
  'dispositifs-suivi-course-soleil',
  'autres-technologies',
] as const;

export const typesFournisseurEolien = [
  'dispositif-de-stockage',
  'poste-conversion',
  'dispositif-de-production',
] as const;

const typesFournisseur = [...typesFournisseurPV, ...typesFournisseurPV];

export type RawType = (typeof typesFournisseur)[number];

export type ValueType = ReadonlyValueType<{
  typeFournisseur: RawType;
  formatter(): RawType;
}>;

export const bind = ({ typeFournisseur }: PlainType<ValueType>): ValueType => {
  return {
    get typeFournisseur() {
      return typeFournisseur;
    },
    estÉgaleÀ(valueType) {
      return this.typeFournisseur === valueType.typeFournisseur;
    },
    formatter() {
      return this.typeFournisseur;
    },
  };
};

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return bind({ typeFournisseur: value });
};

function estValide(value: string): asserts value is RawType {
  const isValid = typesFournisseur.includes(value as RawType);

  if (!isValid) {
    throw new TypeFournisseurInvalideError(value);
  }
}

class TypeFournisseurInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de fournisseur ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
