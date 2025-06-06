import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

import { AucunAbandonEnCours } from './abandon.error';

export const statuts = [
  'accordé',
  'annulé',
  'confirmation-demandée',
  'confirmé',
  'demandé',
  'rejeté',
  'en-instruction',
  'inconnu',
] as const;

export type RawType = (typeof statuts)[number];

const statutsEnCours: Array<RawType> = [
  'confirmation-demandée',
  'confirmé',
  'demandé',
  'en-instruction',
];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estEnAttenteConfirmation: () => boolean;
  estConfirmé: () => boolean;
  estEnCours: () => boolean;
  estAnnulé: () => boolean;
  estDemandé: () => boolean;
  estEnInstruction: () => boolean;
  estConfirmationDemandée: () => boolean;
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
    estEnAttenteConfirmation() {
      return this.statut === 'confirmation-demandée';
    },
    estConfirmé() {
      return this.statut === 'confirmé';
    },
    estAnnulé() {
      return this.statut === 'annulé';
    },
    estDemandé() {
      return this.statut === 'demandé';
    },
    estConfirmationDemandée() {
      return this.statut === 'confirmation-demandée';
    },
    estEnInstruction() {
      return this.statut === 'en-instruction';
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (this.estÉgaleÀ(inconnu) && !nouveauStatut.estDemandé()) {
        throw new AucunAbandonEnCours();
      }
      if (nouveauStatut.estAccordé()) {
        if (this.estAccordé()) {
          throw new AbandonDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new AbandonDéjàRejetéError();
        }
      } else if (nouveauStatut.estAnnulé()) {
        if (this.estAccordé()) {
          throw new AbandonDéjàAccordéError();
        }
        if (this.estRejeté()) {
          throw new AbandonDéjàRejetéError();
        }
        if (this.estConfirmé()) {
          throw new AbandonDéjàConfirméError();
        }
      } else if (nouveauStatut.estConfirmé()) {
        if (this.estAccordé()) {
          throw new AbandonDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new AbandonDéjàRejetéError();
        }

        if (this.estConfirmé()) {
          throw new AbandonDéjàConfirméError();
        }
        if (!this.estEnAttenteConfirmation()) {
          throw new AucuneDemandeConfirmationAbandonError();
        }
      } else if (nouveauStatut.estDemandé()) {
        if (this.estAccordé()) {
          throw new AbandonDéjàAccordéError();
        }

        if (this.estEnCours()) {
          throw new AbandonEnCoursErreur();
        }
      } else if (nouveauStatut.estConfirmationDemandée()) {
        if (this.estAccordé()) {
          throw new AbandonDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new AbandonDéjàRejetéError();
        }

        if (this.estEnAttenteConfirmation()) {
          throw new ConfirmationAbandonDéjàDemandéError();
        }

        if (this.estConfirmé()) {
          throw new AbandonDéjàConfirméError();
        }
      } else if (nouveauStatut.estEnInstruction()) {
        if (this.estAccordé()) {
          throw new AbandonDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new AbandonDéjàRejetéError();
        }
        if (this.estConfirmationDemandée()) {
          throw new DemandeConfirmationAbandonEnCoursInstructionError();
        }
        if (this.estConfirmé()) {
          throw new AbandonConfirméInstructionError();
        }
      } else if (nouveauStatut.estRejeté()) {
        if (this.estAccordé()) {
          throw new AbandonDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new AbandonDéjàRejetéError();
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutAbandonInvalideError(value);
  }
}

export const accordé = convertirEnValueType('accordé');
export const annulé = convertirEnValueType('annulé');
export const confirmationDemandée = convertirEnValueType('confirmation-demandée');
export const confirmé = convertirEnValueType('confirmé');
export const demandé = convertirEnValueType('demandé');
export const rejeté = convertirEnValueType('rejeté');
export const enInstruction = convertirEnValueType('en-instruction');
export const inconnu = convertirEnValueType('inconnu');

class StatutAbandonInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class AbandonDéjàAccordéError extends InvalidOperationError {
  constructor() {
    super(`L'abandon a déjà été accordé`);
  }
}

class AbandonDéjàRejetéError extends InvalidOperationError {
  constructor() {
    super(`L'abandon a déjà été rejeté`);
  }
}

class AbandonEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande d'abandon est déjà en cours`);
  }
}

class AbandonDéjàConfirméError extends InvalidOperationError {
  constructor() {
    super(`L'abandon a déjà été confirmé`);
  }
}

class ConfirmationAbandonDéjàDemandéError extends InvalidOperationError {
  constructor() {
    super(`La confirmation de l'abandon a déjà été demandée`);
  }
}

class AucuneDemandeConfirmationAbandonError extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de confirmation d'abandon en attente`);
  }
}

class DemandeConfirmationAbandonEnCoursInstructionError extends InvalidOperationError {
  constructor() {
    super(
      `Une demande de confirmation d'abandon est en cours et ne peut être passé en instruction`,
    );
  }
}

class AbandonConfirméInstructionError extends InvalidOperationError {
  constructor() {
    super(`L'abandon est confirmé et ne peut être passé en instruction`);
  }
}
