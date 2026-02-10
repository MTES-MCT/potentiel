import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { DemandeChangementInexistanteError } from './changementReprésentantLégal.error.js';

export const statuts = [
  'accordé',
  'annulé',
  'demandé',
  'rejeté',
  'information-enregistrée',
] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  formatter(): RawType;
  estDemandé: () => boolean;
  estAnnulé: () => boolean;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estInformationEnregistrée: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const bind = ({ statut }: PlainType<ValueType>): ValueType => {
  estValide(statut);
  return {
    statut,
    estÉgaleÀ({ statut }) {
      return this.statut === statut;
    },
    formatter() {
      return this.statut;
    },
    estAnnulé() {
      return this.statut === 'annulé';
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
    estInformationEnregistrée() {
      return this.statut === 'information-enregistrée';
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (this.estInformationEnregistrée()) {
        if (nouveauStatut.estAccordé() || nouveauStatut.estAnnulé() || nouveauStatut.estRejeté())
          throw new AucuneDemandeDeChangementEnCoursError();
      }

      if (this.estDemandé()) {
        if (nouveauStatut.estDemandé() || nouveauStatut.estInformationEnregistrée()) {
          throw new DemandeChangementDéjàEnCoursError();
        }
      }

      if (
        (nouveauStatut.estAccordé() || nouveauStatut.estRejeté()) &&
        (this.estAccordé() || this.estRejeté() || this.estAnnulé())
      ) {
        throw new DemandeChangementInexistanteError();
      }

      if (nouveauStatut.estAnnulé()) {
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
    throw new StatutChangementReprésentantLégalInvalideError(value);
  }
}

export const demandé = convertirEnValueType('demandé');
export const annulé = convertirEnValueType('annulé');
export const accordé = convertirEnValueType('accordé');
export const rejeté = convertirEnValueType('rejeté');
export const informationEnregistrée = convertirEnValueType('information-enregistrée');

class StatutChangementReprésentantLégalInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class DemandeChangementDéjàEnCoursError extends InvalidOperationError {
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
    super(`La demande de changement de représentant légal a déjà été rejetée`);
  }
}

class AucuneDemandeDeChangementEnCoursError extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de changement n'est en cours`);
  }
}
