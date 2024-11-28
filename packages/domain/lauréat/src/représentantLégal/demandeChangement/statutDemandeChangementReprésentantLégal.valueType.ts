import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['accordé', 'demandé', 'rejeté', 'inconnu'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  formatter(): RawType;
  estDemandé: () => boolean;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estInconnu: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const bind = ({ statut }: PlainType<ValueType>): ValueType => {
  estValide(statut);
  return {
    statut,
    estÉgaleÀ: function ({ statut }) {
      return this.statut === statut;
    },
    formatter() {
      return this.statut;
    },
    estDemandé() {
      return this.statut === 'demandé';
    },
    estAccordé() {
      return this.statut === 'accordé';
    },
    estRejeté() {
      return this.statut === 'rejeté';
    },
    estInconnu() {
      return this.estÉgaleÀ(inconnu);
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (nouveauStatut.estDemandé()) {
        if (this.estAccordé()) {
          throw new DemandeChangementDéjàAccordéeError();
        }
        if (this.estDemandé()) {
          throw new DemandeChangementDéjàDemandéeError();
        }
      } else if (nouveauStatut.estAccordé()) {
        if (this.estAccordé()) {
          throw new DemandeChangementDéjàAccordéeError();
        }

        if (this.estRejeté()) {
          throw new DemandeChangementDéjàRejetéeError();
        }
      } else if (nouveauStatut.estRejeté()) {
        if (this.estAccordé()) {
          throw new DemandeChangementDéjàAccordéeError();
        }

        if (this.estRejeté()) {
          throw new DemandeChangementDéjàRejetéeError();
        }
      }
    },
  };
};

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return bind({ statut: value });
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutDemandeChangementReprésentantLégalInvalideError(value);
  }
}

export const demandé = convertirEnValueType('demandé');
export const accordé = convertirEnValueType('accordé');
export const rejeté = convertirEnValueType('rejeté');
export const inconnu = convertirEnValueType('inconnu');

class StatutDemandeChangementReprésentantLégalInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class DemandeChangementDéjàDemandéeError extends InvalidOperationError {
  constructor() {
    super(`Une demande de changement de représentant légal est déjà en cours`);
  }
}

class DemandeChangementDéjàAccordéeError extends InvalidOperationError {
  constructor() {
    super(`La demande de changement de représentant légal a déjà été accordée`);
  }
}
class DemandeChangementDéjàRejetéeError extends InvalidOperationError {
  constructor() {
    super(`La demande de changement de représentant légal a déjà été accordée`);
  }
}
