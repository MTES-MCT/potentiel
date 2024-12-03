import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['accordé', 'annulé', 'demandé', 'rejeté', 'inconnu'] as const;

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
          throw new ModificationActionnaireDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new ModificationActionnaireDéjàRejetéError();
        }
      } else if (nouveauStatut.estAnnulé()) {
        if (this.estAccordé()) {
          throw new ModificationActionnaireDéjàAccordéError();
        }
        if (this.estRejeté()) {
          throw new ModificationActionnaireDéjàRejetéError();
        }
      } else if (nouveauStatut.estDemandé()) {
        if (this.estAccordé()) {
          throw new ModificationActionnaireDéjàAccordéError();
        }

        if (this.estEnCours()) {
          throw new ModificationActionnaireEnCoursErreur();
        }
      } else if (nouveauStatut.estRejeté()) {
        if (this.estAccordé()) {
          throw new ModificationActionnaireDéjàAccordéError();
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
    throw new StatutActionnaireInvalideError(value);
  }
}

export const accordé = convertirEnValueType('accordé');
export const annulé = convertirEnValueType('annulé');
export const demandé = convertirEnValueType('demandé');
export const rejeté = convertirEnValueType('rejeté');
export const inconnu = convertirEnValueType('inconnu');

class StatutActionnaireInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class ModificationActionnaireDéjàAccordéError extends InvalidOperationError {
  constructor() {
    super(`La modification d'actionnaire a déjà été accordée`);
  }
}

class ModificationActionnaireDéjàRejetéError extends InvalidOperationError {
  constructor() {
    super(`La modification d'actionnaire a déjà été rejetée`);
  }
}

class ModificationActionnaireEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande d'abandon est déjà en cours`);
  }
}
