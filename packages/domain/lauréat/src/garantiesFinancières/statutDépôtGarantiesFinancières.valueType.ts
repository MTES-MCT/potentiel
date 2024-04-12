import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['validé', 'rejeté', 'en-cours'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estValidé: () => boolean;
  estRejeté: () => boolean;
  estEnCours: () => boolean;
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
    estRejeté() {
      return this.statut === 'rejeté';
    },
    estEnCours() {
      return this.statut === 'en-cours';
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (nouveauStatut.estEnCours()) {
        if (this.estEnCours()) {
          throw new DépôtGarantiesFinancièresDéjàSoumisError();
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutDépôtGarantiesFinancièreInvalideError(value);
  }
}

export const validé = convertirEnValueType('validé');
export const rejeté = convertirEnValueType('rejeté');
export const enCours = convertirEnValueType('en-cours');

class StatutDépôtGarantiesFinancièreInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class DépôtGarantiesFinancièresDéjàSoumisError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà des garanties financières en attente de validation pour ce projet`);
  }
}
