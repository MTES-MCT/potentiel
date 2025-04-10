import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import * as StatutCandidature from './statutCandidature.valueType';

export type ValueType = ReadonlyValueType<{
  statut: StatutCandidature.ValueType;
  noteTotale: number;
  motifÉlimination?: string;
}>;

export const bind = ({ statut, ...otherData }: PlainType<ValueType>): ValueType => {
  return {
    statut: StatutCandidature.bind(statut),
    ...otherData,
    estÉgaleÀ(value) {
      return (
        this.statut.estÉgaleÀ(value.statut) &&
        this.noteTotale === value.noteTotale &&
        this.motifÉlimination === value.motifÉlimination
      );
    },
  };
};
