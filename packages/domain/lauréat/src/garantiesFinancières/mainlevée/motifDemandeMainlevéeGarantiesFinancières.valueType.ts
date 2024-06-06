import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const motifs = ['projet-abandonné', 'projet-achevé'] as const;

export type RawType = (typeof motifs)[number];

export type ValueType = ReadonlyValueType<{
  motif: RawType;
  estProjetAbandonné: () => boolean;
  estProjetAchevé: () => boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get motif() {
      return value;
    },
    estÉgaleÀ(valueType) {
      return this.motif === valueType.motif;
    },
    estProjetAbandonné() {
      return this.motif === 'projet-abandonné';
    },
    estProjetAchevé() {
      return this.motif === 'projet-achevé';
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = motifs.includes(value as RawType);

  if (!isValid) {
    throw new MotifDemandeMainlevéeInvalideError(value);
  }
}

export const projetAbandonné = convertirEnValueType('projet-abandonné');
export const projetAchevé = convertirEnValueType('projet-achevé');

class MotifDemandeMainlevéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif de demande de mainlevée est inconnu`, {
      value,
    });
  }
}
