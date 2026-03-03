import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const motifs = [
  'recours-accordé',
  'changement-producteur',
  'échéance-garanties-financières-actuelles',
  'non-déposé',
] as const;

export type RawType = (typeof motifs)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  motif: Type;
  estRecoursAccordé: () => boolean;
  estChangementProducteur: () => boolean;
  estÉchéance: () => boolean;
  estNonDéposé: () => boolean;
  formatter(): Type;
}>;

export const bind = <Type extends RawType = RawType>({
  motif,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(motif);
  return {
    get motif() {
      return motif as Type;
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
    estNonDéposé() {
      return this.motif === 'non-déposé';
    },
    formatter() {
      return this.motif;
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
    throw new MotifDemandeGarantiesFinancièresInvalideError(value);
  }
}

export const recoursAccordé = convertirEnValueType<'recours-accordé'>('recours-accordé');
export const changementProducteur =
  convertirEnValueType<'changement-producteur'>('changement-producteur');
export const échéanceGarantiesFinancièresActuelles =
  convertirEnValueType<'échéance-garanties-financières-actuelles'>(
    'échéance-garanties-financières-actuelles',
  );
export const nonDéposé = convertirEnValueType<'non-déposé'>('non-déposé');

class MotifDemandeGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le motif ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
