import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const motifs = ['projet-abandonné', 'projet-achevé'] as const;

export type RawType = (typeof motifs)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  motif: Type;
  formatter: () => Type;
  estProjetAbandonné: () => boolean;
  estProjetAchevé: () => boolean;
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

class MotifDemandeMainlevéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif de demande de mainlevée est inconnu`, {
      value,
    });
  }
}
