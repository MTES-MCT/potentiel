import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const motifs = [
  'recours-accordé',
  'changement-producteur',
  'échéance-garanties-financières-actuelles',
  'garanties-financières-initiales',
] as const;

export type RawType = (typeof motifs)[number];

export type ValueType = ReadonlyValueType<{
  motif: RawType;
  estRecoursAccordé: () => boolean;
  estChangementProducteur: () => boolean;
  estÉchéance: () => boolean;
  estGarantiesFinancièresInitiales: () => boolean;
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
    estRecoursAccordé() {
      return this.motif === 'recours-accordé';
    },
    estChangementProducteur() {
      return this.motif === 'changement-producteur';
    },
    estÉchéance() {
      return this.motif === 'échéance-garanties-financières-actuelles';
    },

    estGarantiesFinancièresInitiales() {
      return this.motif === 'garanties-financières-initiales';
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = motifs.includes(value as RawType);

  if (!isValid) {
    throw new MotifDemandeGarantiesFinancièresInvalideError(value);
  }
}

export const recoursAccordé = convertirEnValueType('recours-accordé');
export const changementProducteur = convertirEnValueType('changement-producteur');
export const échéanceGarantiesFinancièresActuelles = convertirEnValueType(
  'échéance-garanties-financières-actuelles',
);
export const garantiesFinancièresInitiales = convertirEnValueType(
  'garanties-financières-initiales',
);

class MotifDemandeGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
