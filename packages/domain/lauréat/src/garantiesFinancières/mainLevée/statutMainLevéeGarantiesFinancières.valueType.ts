import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['demandé', 'en-instruction', 'accordé', 'rejeté'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estDemandé: () => boolean;
  estEnInstruction: () => boolean;
  estRejeté: () => boolean;
  estAccordé: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get statut() {
      return value;
    },
    estDemandé() {
      return this.statut === 'demandé';
    },
    estEnInstruction() {
      return this.statut === 'en-instruction';
    },
    estRejeté() {
      return this.statut === 'rejeté';
    },
    estAccordé() {
      return this.statut === 'accordé';
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (nouveauStatut.estDemandé()) {
        if (this.estDemandé()) {
          throw new MainLevéeDéjàDemandéeError();
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutMainLevéeInvalideError(value);
  }
}

export const demandé = convertirEnValueType('demandé');
export const enInstruction = convertirEnValueType('en-instruction');
export const accordé = convertirEnValueType('accordé');
export const rejeté = convertirEnValueType('rejeté');

class StatutMainLevéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class MainLevéeDéjàDemandéeError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une demande de main-levée en cours`);
  }
}
