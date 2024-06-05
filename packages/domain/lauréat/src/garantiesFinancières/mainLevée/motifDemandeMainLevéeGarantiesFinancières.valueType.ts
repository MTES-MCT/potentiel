import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const motifs = ['projet-abandonné', 'projet-achevé'] as const;

export type RawMotif = (typeof motifs)[number];

export type ValueType = ReadonlyValueType<{
  motif: RawMotif;
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

function estValide(value: string): asserts value is RawMotif {
  const isValid = motifs.includes(value as RawMotif);

  if (!isValid) {
    throw new MotifDemandeMainLevéeInvalideError(value);
  }
}

export const projetAbandonné = convertirEnValueType('projet-abandonné');
export const projetAchevé = convertirEnValueType('projet-achevé');

class MotifDemandeMainLevéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif de demande de main levée est inconnu`, {
      value,
    });
  }
}
