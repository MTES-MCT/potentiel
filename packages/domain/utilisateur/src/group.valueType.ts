import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { GroupeRefuséError } from './errors';

export type GroupType = 'GestionnairesRéseau';
export type RawType = `/${GroupType}/${string}`;

export type ValueType = ReadonlyValueType<{
  type: GroupType;
  nom: string;
  formatter(): RawType;
}>;

// the regex accepts any letter character (not only A-Z) and whitespaces due to names like "EDF Réunion"
const groupRegex = /\/(?<type>GestionnairesRéseau)\/(?<nom>[\p{L}0-9\-\s]+$)$/u;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  const { nom, type } = value.match(groupRegex)!.groups!;
  return {
    type: type as GroupType,
    nom,
    estÉgaleÀ(valueType) {
      return valueType.type === this.type && valueType.nom === this.nom;
    },
    formatter() {
      return `/${this.type}/${this.nom}`;
    },
  };
};

export const bind = ({ nom }: PlainType<ValueType>) => {
  return convertirEnValueType(nom);
};

export const estUnGroupeValide = (value: string) => {
  return groupRegex.test(value);
};

function estValide(value: string): asserts value is RawType {
  const isValid = estUnGroupeValide(value);

  if (!isValid) {
    throw new GroupeRefuséError(value);
  }
}
