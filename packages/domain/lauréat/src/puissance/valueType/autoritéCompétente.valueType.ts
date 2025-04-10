import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const autoritéCompétentes = ['dreal', 'dgec-admin'] as const;

export type RawType = (typeof autoritéCompétentes)[number];

export type ValueType = ReadonlyValueType<{
  ratio: number;
  getAutoritéCompétente: () => RawType;
}>;

export const bind = ({ ratio }: PlainType<ValueType>): ValueType => {
  return {
    get ratio() {
      return ratio;
    },
    getAutoritéCompétente(): RawType {
      return ratio < 1 ? 'dreal' : 'dgec-admin';
    },
    estÉgaleÀ(valueType) {
      return this.ratio === valueType.ratio;
    },
  };
};
