import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { GroupeRefuséError } from './errors';

export type GroupType = 'GRDs';
export type RawType = `/${GroupType}/${string}`;

export type ValueType = ReadonlyValueType<{
  type: GroupType;
  nom: string;
  formatter(): RawType;
}>;

const groupRegex = /\/(?<type>GRDs)\/(?<nom>[a-zA-Z0-9]+)/;

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
