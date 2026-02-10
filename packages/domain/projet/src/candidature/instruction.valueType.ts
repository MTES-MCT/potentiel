import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { StatutCandidature } from './index.js';

export type RawType = {
  statut: StatutCandidature.RawType;
  noteTotale: number;
  motifÉlimination?: string;
};
export type ValueType = ReadonlyValueType<{
  statut: StatutCandidature.ValueType;
  noteTotale: number;
  motifÉlimination?: string;
  formatter(): RawType;
}>;

export const bind = ({
  statut,
  noteTotale,
  motifÉlimination,
}: PlainType<ValueType>): ValueType => ({
  statut: StatutCandidature.bind(statut),
  noteTotale,
  motifÉlimination,
  estÉgaleÀ(valueType) {
    return (
      this.statut.estÉgaleÀ(valueType.statut) &&
      this.motifÉlimination === valueType.motifÉlimination &&
      this.noteTotale === valueType.noteTotale
    );
  },
  formatter() {
    return {
      statut: this.statut.formatter(),
      noteTotale: this.noteTotale,
      motifÉlimination: this.motifÉlimination,
    };
  },
});

export const convertirEnValueType = ({ statut, noteTotale, motifÉlimination }: RawType) =>
  bind({
    statut: StatutCandidature.convertirEnValueType(statut),
    noteTotale,
    motifÉlimination,
  });
