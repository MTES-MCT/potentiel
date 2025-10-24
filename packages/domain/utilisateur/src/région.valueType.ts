import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const régionsMétropole = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  "Provence-Alpes-Côte d'Azur",
] as const;

export const régionsZNIHorsMayotte = [
  'Corse',
  'Guadeloupe',
  'Guyane',
  'La Réunion',
  'Martinique',
] as const;
export const régionsZNI = [...régionsZNIHorsMayotte, 'Mayotte'] as const;

export const régions = [...régionsMétropole, ...régionsZNI];

export type RawType = (typeof régions)[number];

export type ValueType = ReadonlyValueType<{
  nom: RawType;
  formatter: () => RawType;
  isZNI: () => boolean;
}>;

export const bind = ({ nom }: { nom: string }): ValueType => {
  estValide(nom);
  return {
    nom,
    formatter() {
      return this.nom;
    },
    estÉgaleÀ(value) {
      return this.nom === value.nom;
    },
    isZNI() {
      return (régionsZNI as readonly string[]).includes(this.nom);
    },
  };
};

export const convertirEnValueType = (nom: string) => bind({ nom });

function estValide(value: string): asserts value is RawType {
  const isValid = (régions as readonly string[]).includes(value);

  if (!isValid) {
    throw new RégionInvalideError(value);
  }
}

class RégionInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super('La région est invalide', { value });
  }
}
