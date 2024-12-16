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
      if (nouveauStatut.estEnCours() && this.estEnCours()) {
        throw new DemandeChangementActionnaireDéjàEnCoursErreur();
      } else {
        const demandeDevraitÊtreEnCours =
          nouveauStatut.estAccordé() || nouveauStatut.estAnnulé() || nouveauStatut.estRejeté();

        if (demandeDevraitÊtreEnCours) {
          if (this.estAccordé()) {
            throw new DemandeChangementActionnaireDéjàAccordéeErreur();
          }
          if (this.estAnnulé()) {
            throw new DemandeChangementActionnaireDéjàAnnuléeErreur();
          }
          if (this.estRejeté()) {
            throw new DemandeChangementActionnaireDéjàRejetéeErreur();
          }
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutChangementActionnaireInvalideError(value);
  }
}

export const accordé = convertirEnValueType('accordé');
export const annulé = convertirEnValueType('annulé');
export const demandé = convertirEnValueType('demandé');
export const rejeté = convertirEnValueType('rejeté');

class StatutChangementActionnaireInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class DemandeChangementActionnaireDéjàAccordéeErreur extends InvalidOperationError {
  constructor() {
    super(`La demande de changement d'actionnaire a déjà été accordée`);
  }
}

class DemandeChangementActionnaireDéjàRejetéeErreur extends InvalidOperationError {
  constructor() {
    super(`La demande de changement d'actionnaire a déjà été rejetée`);
  }
}

class DemandeChangementActionnaireDéjàAnnuléeErreur extends InvalidOperationError {
  constructor() {
    super(`La demande de changement d'actionnaire a déjà été annulée`);
  }
}

class DemandeChangementActionnaireDéjàEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande de changement est déjà en cours`);
  }
}
