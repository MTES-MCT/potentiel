import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const états = ['validé', 'dépôt-en-cours'] as const;

export type RawType = (typeof états)[number];

export type ValueType = ReadonlyValueType<{
  état: RawType;
  estValidé: () => boolean;
  estDépôtEnCours: () => boolean;
  vérifierQueLeChangementDÉtatEstPossibleEn: (nouvelÉtat: ValueType) => void;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get état() {
      return value;
    },
    estValidé() {
      return this.état === 'validé';
    },
    estDépôtEnCours() {
      return this.état === 'dépôt-en-cours';
    },
    estÉgaleÀ(valueType) {
      return this.état === valueType.état;
    },
    vérifierQueLeChangementDÉtatEstPossibleEn(nouvelÉtat: ValueType) {
      if (nouvelÉtat.estDépôtEnCours()) {
        if (this.estDépôtEnCours()) {
          throw new DépôtGarantiesFinancièresDéjàSoumisError();
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = états.includes(value as RawType);

  if (!isValid) {
    throw new ÉtatGarantiesFinancièreInvalideError(value);
  }
}

export const validé = convertirEnValueType('validé');
export const dépôtEnCours = convertirEnValueType('dépôt-en-cours');

class ÉtatGarantiesFinancièreInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'état des garanties financières ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class DépôtGarantiesFinancièresDéjàSoumisError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà des garanties financières en attente de validation pour ce projet`);
  }
}
