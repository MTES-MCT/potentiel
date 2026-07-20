import type { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { StatutCandidature } from './index.js';

export type RawType = {
  statut: StatutCandidature.RawType;
  noteTotale: number;
  motifÉlimination?: string;
  volumeRéservé?: boolean;
};
export type ValueType = ReadonlyValueType<{
  statut: StatutCandidature.ValueType;
  noteTotale: number;
  motifÉlimination?: string;
  volumeRéservé?: boolean;
  formatter(): RawType;
}>;

export const bind = ({
  statut,
  noteTotale,
  motifÉlimination,
  volumeRéservé,
}: PlainType<ValueType>): ValueType => ({
  statut: StatutCandidature.bind(statut),
  noteTotale,
  motifÉlimination,
  volumeRéservé,
  estÉgaleÀ(valueType) {
    return (
      this.statut.estÉgaleÀ(valueType.statut) &&
      this.motifÉlimination === valueType.motifÉlimination &&
      this.noteTotale === valueType.noteTotale &&
      this.volumeRéservé === valueType.volumeRéservé
    );
  },
  formatter() {
    return {
      statut: this.statut.formatter(),
      noteTotale: this.noteTotale,
      motifÉlimination: this.motifÉlimination,
      volumeRéservé: this.volumeRéservé,
    };
  },
});

export const convertirEnValueType = ({
  statut,
  noteTotale,
  motifÉlimination,
  volumeRéservé,
}: RawType) =>
  bind({
    statut: StatutCandidature.convertirEnValueType(statut),
    noteTotale,
    motifÉlimination,
    volumeRéservé,
  });
