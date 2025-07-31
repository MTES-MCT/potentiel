import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['accordé', 'annulé', 'demandé', 'rejeté', 'en-instruction'] as const;

export type RawType = (typeof statuts)[number];

export const statutsEnCours: Array<RawType> = ['demandé', 'en-instruction'];

export type ValueType<T extends RawType = RawType> = ReadonlyValueType<{
  statut: T;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estEnCours: () => boolean;
  estAnnulé: () => boolean;
  estDemandé: () => boolean;
  estEnInstruction: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const convertirEnValueType = <T extends RawType = RawType>(value: string): ValueType<T> => {
  estValide(value);
  return {
    get statut() {
      return value as T;
    },
    estAccordé() {
      return this.statut === 'accordé';
    },
    estEnCours() {
      return statutsEnCours.includes(value);
    },
    estRejeté() {
      return this.statut === 'rejeté';
    },
    estAnnulé() {
      return this.statut === 'annulé';
    },
    estDemandé() {
      return this.statut === 'demandé';
    },
    estEnInstruction() {
      return this.statut === 'en-instruction';
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (nouveauStatut.estAccordé()) {
        if (this.estAccordé()) {
          throw new DélaiDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new DélaiDéjàRejetéError();
        }
      } else if (nouveauStatut.estAnnulé()) {
        if (this.estAccordé()) {
          throw new DélaiDéjàAccordéError();
        }
        if (this.estRejeté()) {
          throw new DélaiDéjàRejetéError();
        }
      } else if (nouveauStatut.estDemandé()) {
        if (this.estAccordé()) {
          throw new DélaiDéjàAccordéError();
        }

        if (this.estEnCours()) {
          throw new DélaiEnCoursErreur();
        }
      } else if (nouveauStatut.estEnInstruction()) {
        if (this.estAccordé()) {
          throw new DélaiDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new DélaiDéjàRejetéError();
        }
      } else if (nouveauStatut.estRejeté()) {
        if (this.estAccordé()) {
          throw new DélaiDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new DélaiDéjàRejetéError();
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutDélaiInvalideError(value);
  }
}

export const accordé = convertirEnValueType<'accordé'>('accordé');
export const annulé = convertirEnValueType<'annulé'>('annulé');
export const demandé = convertirEnValueType<'demandé'>('demandé');
export const rejeté = convertirEnValueType<'rejeté'>('rejeté');
export const enInstruction = convertirEnValueType<'en-instruction'>('en-instruction');

class StatutDélaiInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, { value });
  }
}

class DélaiDéjàAccordéError extends InvalidOperationError {
  constructor() {
    super(`La demande de délai a déjà été accordé`);
  }
}

class DélaiDéjàRejetéError extends InvalidOperationError {
  constructor() {
    super(`La demande de délai a déjà été rejetée`);
  }
}

class DélaiEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande de délai est déjà en cours`);
  }
}
