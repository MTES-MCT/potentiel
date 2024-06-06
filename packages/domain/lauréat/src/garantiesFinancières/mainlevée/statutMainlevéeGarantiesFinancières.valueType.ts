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
          throw new MainlevéeDéjàDemandéeError();
        }
        if (this.estAccordé()) {
          throw new DemandeMainlevéeDéjàAccordéeError();
        }
        if (this.estEnInstruction()) {
          throw new DemandeMainlevéeDéjàEnInstructionError();
        }
      }

      if (nouveauStatut.estEnInstruction()) {
        if (this.estEnInstruction()) {
          throw new DemandeMainlevéeDéjàEnInstructionError();
        }
        if (this.estAccordé()) {
          throw new DemandeMainlevéeDéjàAccordéeError();
        }
        if (this.estRejeté()) {
          throw new DemandeMainlevéeDéjàRejetéeError();
        }
      }

      if (nouveauStatut.estRejeté() || nouveauStatut.estAccordé()) {
        if (this.estAccordé()) {
          throw new DemandeMainlevéeDéjàAccordéeError();
        }
        if (this.estRejeté()) {
          throw new DemandeMainlevéeDéjàRejetéeError();
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutMainlevéeInvalideError(value);
  }
}

export const demandé = convertirEnValueType('demandé');
export const enInstruction = convertirEnValueType('en-instruction');
export const accordé = convertirEnValueType('accordé');
export const rejeté = convertirEnValueType('rejeté');

class StatutMainlevéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class MainlevéeDéjàDemandéeError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une demande de mainlevée en cours pour ce projet`);
  }
}

class DemandeMainlevéeDéjàEnInstructionError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une demande de mainlevée en instruction pour ce projet`);
  }
}

class DemandeMainlevéeDéjàAccordéeError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une demande de mainlevée accordée pour ce projet`);
  }
}

class DemandeMainlevéeDéjàRejetéeError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une demande de mainlevée rejetée pour ce projet`);
  }
}
