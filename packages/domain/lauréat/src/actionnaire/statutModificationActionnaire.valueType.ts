import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['accordé', 'annulé', 'demandé', 'rejeté'] as const;

export type RawType = (typeof statuts)[number];

const statutsEnCours: Array<RawType> = ['demandé'];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estEnCours: () => boolean;
  estAnnulé: () => boolean;
  estDemandé: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get statut() {
      return value;
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
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (nouveauStatut.estAccordé()) {
        if (this.estAccordé()) {
          throw new ModificationActionnaireDéjàAccordéeError();
        }

        if (this.estRejeté()) {
          throw new ModificationActionnaireDéjàRejetéError();
        }
      } else if (nouveauStatut.estAnnulé()) {
        if (this.estAccordé()) {
          throw new ModificationActionnaireDéjàAccordéeError();
        }
        if (this.estRejeté()) {
          throw new ModificationActionnaireDéjàRejetéError();
        }
      } else if (nouveauStatut.estDemandé()) {
        if (this.estAccordé()) {
          throw new ModificationActionnaireDéjàAccordéeError();
        }

        if (this.estEnCours()) {
          throw new ModificationActionnaireEnCoursErreur();
        }
      } else if (nouveauStatut.estRejeté()) {
        if (this.estAccordé()) {
          throw new ModificationActionnaireDéjàAccordéeError();
        }

        if (this.estRejeté()) {
          throw new ModificationActionnaireDéjàRejetéError();
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutModificationActionnaireInvalideError(value);
  }
}

export const accordé = convertirEnValueType('accordé');
export const annulé = convertirEnValueType('annulé');
export const demandé = convertirEnValueType('demandé');
export const rejeté = convertirEnValueType('rejeté');

class StatutModificationActionnaireInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class ModificationActionnaireDéjàAccordéeError extends InvalidOperationError {
  constructor() {
    super(`L'abandon a déjà été accordé`);
  }
}

class ModificationActionnaireDéjàRejetéError extends InvalidOperationError {
  constructor() {
    super(`L'abandon a déjà été rejeté`);
  }
}

class ModificationActionnaireEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande d'abandon est déjà en cours`);
  }
}
