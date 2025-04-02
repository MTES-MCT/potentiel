import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

// work in progress
// ce value type sera utilisé pour vérifier les règles de ratios de puissance
// ainsi que pour la règle liée à l'autorité compétente
export const autoritéCompétentes = ['dreal', 'dgec'] as const;

export type AutoritésCompétentes = (typeof autoritéCompétentes)[number];

export type RawType = number;

export type ValueType = ReadonlyValueType<{
  ratio: number;
  déterminerAutoritéCompétente: () => AutoritésCompétentes;
}>;

export const bind = ({ ratio }: PlainType<ValueType>): ValueType => {
  return {
    get ratio() {
      return ratio;
    },
    estÉgaleÀ(valueType) {
      return this.ratio === valueType.ratio;
    },
    déterminerAutoritéCompétente(): AutoritésCompétentes {
      return ratio < 1 ? 'dreal' : 'dgec';
    },
  };
};
