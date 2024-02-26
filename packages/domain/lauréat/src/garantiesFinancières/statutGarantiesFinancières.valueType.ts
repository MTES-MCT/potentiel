import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['validé', 'en-attente', 'à-traiter'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estValidé: () => boolean;
  estEnAttente: () => boolean;
  estÀTraiter: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get statut() {
      return value;
    },
    estValidé() {
      return this.statut === 'validé';
    },
    estEnAttente() {
      return this.statut === 'en-attente';
    },
    estÀTraiter() {
      return this.statut === 'à-traiter';
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (nouveauStatut.estÀTraiter()) {
        if (this.estÀTraiter()) {
          throw new GarantiesFinancièresÀTraitéDéjàEnvoyéesError();
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutGarantiesFinancièreInvalideError(value);
  }
}

export const validé = convertirEnValueType('validé');
export const àTraiter = convertirEnValueType('à-traiter');
export const enAttente = convertirEnValueType('en-attente');

class StatutGarantiesFinancièreInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class GarantiesFinancièresÀTraitéDéjàEnvoyéesError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà des garanties financières en attente de validation pour ce projet`);
  }
}
