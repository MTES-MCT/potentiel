import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const motif = [
  'changement de producteur',
  'renouvellement des garanties financières échues',
  'modification des garanties financières',
] as const;

export type RawType = (typeof motif)[number];

export type ValueType = ReadonlyValueType<{
  motif: RawType;
  estChangementDeProducteur: () => boolean;
  estRenouvellementDesGarantiesFinancièresÉchues: () => boolean;
  estModificationDesGarantiesFinancières: () => boolean;
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

function estValide(value: string): asserts value is RawType {
  const isValid = motif.includes(value as RawType);

  if (!isValid) {
    throw new MotifArchivageGarantiesFinancièresInvalideError(value);
  }
}

export const changementDeProducteur = convertirEnValueType('changement de producteur');
export const renouvellementDesGarantiesFinancièresÉchues = convertirEnValueType(
  'renouvellement des garanties financières échues',
);
export const modificationDesGarantiesFinancières = convertirEnValueType(
  'modification des garanties financières',
);

class MotifArchivageGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif d'archivage des garanties financières est inconnu`, {
      value,
    });
  }
}
