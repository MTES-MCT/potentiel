import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const typesFournisseur = [
  'moduleOuFilms',
  'cellules',
  'plaquettesSilicium',
  'polysilicium',
  'postesConversion',
  'structures',
  'dispositifsStockageEnergie',
  'dispositifsSuiviCourseSoleil',
  'autresTechnologies',
] as const;

export type RawType = (typeof typesFournisseur)[number];

export type ValueType = ReadonlyValueType<{
  typeFournisseur: RawType;
}>;

export const bind = ({ typeFournisseur }: PlainType<ValueType>): ValueType => {
  return {
    get typeFournisseur() {
      return typeFournisseur;
    },
    estÉgaleÀ(valueType) {
      return this.typeFournisseur === valueType.typeFournisseur;
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
