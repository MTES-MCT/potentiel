import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const motifs = ['projet-abandonné', 'projet-achevé'] as const;

export type RawType = (typeof motifs)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estProjetAbandonné: () => boolean;
  estProjetAchevé: () => boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get statut() {
      return value;
    },
    estProjetAbandonné() {
      return this.statut === 'projet-abandonné';
    },
    estProjetAchevé() {
      return this.statut === 'projet-achevé';
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = motifs.includes(value as RawType);

  if (!isValid) {
    throw new MotifDemandeMainLevéeInvalideError(value);
  }
}

export const demandé = convertirEnValueType('demandé');
export const enInstruction = convertirEnValueType('en-instruction');
export const accordé = convertirEnValueType('accordé');
export const rejeté = convertirEnValueType('rejeté');

class MotifDemandeMainLevéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
