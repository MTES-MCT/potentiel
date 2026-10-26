import {
  InvalidOperationError,
  type PlainType,
  type ReadonlyValueType,
} from '@potentiel-domain/core';

export const motifs = ['projet-abandonné', 'projet-achevé', 'accordé-avec-l-abandon'] as const;

export type RawType = (typeof motifs)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  motif: Type;
  formatter: () => Type;
  estProjetAbandonné: () => boolean;
  estProjetAchevé: () => boolean;
  estAccordéAvecLAbandon: () => boolean;
}>;

export const bind = <Type extends RawType = RawType>({
  motif,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(motif);
  return {
    get motif() {
      return motif as Type;
    },
    formatter() {
      return this.motif;
    },
    estProjetAbandonné() {
      return this.motif === 'projet-abandonné';
    },
    estProjetAchevé() {
      return this.motif === 'projet-achevé';
    },
    estAccordéAvecLAbandon() {
      return this.motif === 'accordé-avec-l-abandon';
    },
    estÉgaleÀ({ motif }) {
      return this.motif === motif;
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(motif: string) => {
  estValide(motif);
  return bind<Type>({ motif });
};

function estValide(value: string): asserts value is RawType {
  const isValid = motifs.includes(value as RawType);

  if (!isValid) {
    throw new MotifDemandeMainlevéeInvalideError(value);
  }
}

export const projetAbandonné = convertirEnValueType<'projet-abandonné'>('projet-abandonné');
export const projetAchevé = convertirEnValueType<'projet-achevé'>('projet-achevé');
export const accordéAvecLAbandon =
  convertirEnValueType<'accordé-avec-l-abandon'>('accordé-avec-l-abandon');

class MotifDemandeMainlevéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif de demande de mainlevée est inconnu`, {
      value,
    });
  }
}
