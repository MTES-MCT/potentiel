import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

import { assertUnreachable } from '../utils/assertUnreachable';

export const statuts = ['accordé', 'annulé', 'demandé', 'rejeté'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
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
      if (this.statut === 'demandé') {
        if (nouveauStatut.statut === 'demandé') {
          throw new DemandeChangementActionnaireDéjàEnCoursErreur();
        }
        return;
      }

      switch (this.statut) {
        case 'accordé':
          throw new DemandeChangementActionnaireDéjàAccordéeErreur();
        case 'annulé':
          throw new DemandeChangementActionnaireDéjàAnnuléeErreur();
        case 'rejeté':
          throw new DemandeChangementActionnaireDéjàRejetéeErreur();
        default:
          assertUnreachable(this.statut);
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
