import {
  InvalidOperationError,
  type PlainType,
  type ReadonlyValueType,
} from '@potentiel-domain/core';

export const motifs = ['force-majeure', 'prolongation-phase-essai'] as const;
export type RawType = (typeof motifs)[number];

export type ValueType<T extends RawType = RawType> = ReadonlyValueType<{
  motif: T;
  formatter(): T;
  estForceMajeure(): boolean;
  estProlongationPhaseEssai(): boolean;
}>;

export const bind = <T extends RawType = RawType>({
  motif,
}: PlainType<ValueType>): ValueType<T> => {
  estValide(motif);
  return {
    motif: motif as T,
    formatter() {
      return this.motif as T;
    },
    estÉgaleÀ(motif: ValueType) {
      return this.motif === motif.motif;
    },
    estForceMajeure() {
      return this.motif === 'force-majeure';
    },
    estProlongationPhaseEssai() {
      return this.motif === 'prolongation-phase-essai';
    },
  };
};

export const convertirEnValueType = <T extends RawType = RawType>(motif: string): ValueType<T> => {
  estValide(motif);
  return bind({ motif });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (motifs as readonly string[]).includes(value);

  if (!isValid) {
    throw new MotifDélaiInvalideError(value);
  }
}

class MotifDélaiInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif de délai ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
