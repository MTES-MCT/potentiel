import { InvalidOperationError } from '@potentiel-domain/core';

export type RawType =
  | 'accordé'
  | 'annulé'
  | 'confirmation-demandée'
  | 'confirmé'
  | 'demandé'
  | 'rejeté';

const statuts: Array<RawType> = [
  'accordé',
  'annulé',
  'confirmation-demandée',
  'confirmé',
  'demandé',
  'rejeté',
];
const statutsEnCours: Array<RawType> = ['confirmation-demandée', 'confirmé', 'demandé'];

export type ValueType = Readonly<{
  statut: RawType;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estEnAttenteConfirmation: () => boolean;
  estConfirmé: () => boolean;
  estEnCours: () => boolean;
  estAnnulé: () => boolean;
  estDemandé: () => boolean;
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
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
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
      } else if (nouveauStatut.estConfirmé()) {
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
  const isValid = (statuts as Array<string>).includes(value);

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

class StatutAbandonInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class AbandonDéjàAccordéError extends InvalidOperationError {
  constructor() {
    super(`Abandon déjà accordé`);
  }
}

class AbandonDéjàRejetéError extends InvalidOperationError {
  constructor() {
    super(`Abandon déjà rejeté`);
  }
}

export class AbandonEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande d'abandon est déjà en cours pour le projet`);
  }
}

export class AbandonDéjàConfirméError extends InvalidOperationError {
  constructor() {
    super(`Abandon déjà confirmé`);
  }
}

export class ConfirmationAbandonDéjàDemandéError extends InvalidOperationError {
  constructor() {
    super(`Confirmation de l'abandon déjà demandé`);
  }
}

export class AucuneDemandeConfirmationAbandonError extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de confirmation d'abandon en attente`);
  }
}

export class AbandonEnAttenteConfirmationError extends InvalidOperationError {
  constructor() {
    super(`L'abandon est en attente de confirmation`);
  }
}
