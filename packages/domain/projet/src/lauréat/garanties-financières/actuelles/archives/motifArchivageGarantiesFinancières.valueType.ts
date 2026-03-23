import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const motif = [
  'changement de producteur',
  'renouvellement des garanties financières échues',
  'modification des garanties financières',
] as const;

export type RawType = (typeof motif)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  motif: Type;
  formatter: () => Type;
  estChangementDeProducteur: () => boolean;
  estRenouvellementDesGarantiesFinancièresÉchues: () => boolean;
  estModificationDesGarantiesFinancières: () => boolean;
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
    estÉgaleÀ({ motif }) {
      return this.motif === motif;
    },
    estChangementDeProducteur() {
      return this.motif === 'changement de producteur';
    },
    estRenouvellementDesGarantiesFinancièresÉchues() {
      return this.motif === 'renouvellement des garanties financières échues';
    },
    estModificationDesGarantiesFinancières() {
      return this.motif === 'modification des garanties financières';
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(motif: string) => {
  estValide(motif);
  return bind<Type>({ motif });
};

function estValide(value: string): asserts value is RawType {
  const isValid = motif.includes(value as RawType);

  if (!isValid) {
    throw new MotifArchivageGarantiesFinancièresInvalideError(value);
  }
}

export const changementDeProducteur = convertirEnValueType<'changement de producteur'>(
  'changement de producteur',
);
export const renouvellementDesGarantiesFinancièresÉchues =
  convertirEnValueType<'renouvellement des garanties financières échues'>(
    'renouvellement des garanties financières échues',
  );
export const modificationDesGarantiesFinancières =
  convertirEnValueType<'modification des garanties financières'>(
    'modification des garanties financières',
  );

class MotifArchivageGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif d'archivage des garanties financières est inconnu`, {
      value,
    });
  }
}
