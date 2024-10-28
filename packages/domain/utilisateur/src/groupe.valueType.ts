import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { GroupeRefuséError } from './errors';

export type GroupeType = 'GestionnairesRéseau';
export type RawType = `/${GroupeType}/${string}`;

export type ValueType = ReadonlyValueType<{
  type: GroupeType;
  nom: string;
  formatter(): RawType;
}>;

// the regex accepts any letter character (not only A-Z) and whitespaces due to names like "EDF Réunion"
const groupeRegex = /\/(?<type>GestionnairesRéseau)\/(?<nom>[\p{L}0-9\-\s]+$)$/u;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  const { nom, type } = value.match(groupeRegex)!.groups!;
  return {
    type: type as GroupeType,
    nom,
    estÉgaleÀ(valueType) {
      return valueType.type === this.type && valueType.nom === this.nom;
    },
    formatter() {
      return `/${this.type}/${this.nom}`;
    },
  };
};

export const bind = ({ nom, type }: PlainType<ValueType>) => {
  return convertirEnValueType(`${type}/${nom}`);
};

export const estUnGroupeValide = (value: string) => {
  return groupeRegex.test(value);
};

function estValide(value: string): asserts value is RawType {
  const isValid = estUnGroupeValide(value);

  if (!isValid) {
    throw new GroupeRefuséError(value);
  }
}
