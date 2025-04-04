import { match } from 'ts-pattern';

import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = [
  'accordé',
  'annulé',
  'demandé',
  'rejeté',
  'information-enregistrée',
] as const;

export type RawType = (typeof statuts)[number];

export type ValueType<T extends RawType = RawType> = ReadonlyValueType<{
  statut: T;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estAnnulé: () => boolean;
  estDemandé: () => boolean;
  estInformationEnregistrée: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const bind = <T extends RawType = RawType>(value: string): ValueType<T> => {
  estValide(value);
  return {
    get statut() {
      return value as T;
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
    estInformationEnregistrée() {
      return this.statut === 'information-enregistrée';
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (this.statut === 'information-enregistrée') {
        throw new AucuneDemandeDeChangementEnCoursErreur();
      }
      if (this.statut === 'demandé') {
        if (
          nouveauStatut.statut === 'demandé' ||
          nouveauStatut.statut === 'information-enregistrée'
        ) {
          throw new ChangementPuissanceDéjàEnCoursErreur();
        }
        return;
      } else if (nouveauStatut.statut !== 'demandé') {
        const error = match<RawType>(this.statut)
          .with('accordé', () => new ChangementPuissanceDéjàAccordéeErreur())
          .with('annulé', () => new ChangementPuissanceDéjàAnnuléeErreur())
          .with('rejeté', () => new ChangementPuissanceDéjàRejetéeErreur())
          .otherwise(() => {});
        throw error;
      }
      return;
    },
  };
};

export const convertirEnValueType = <T extends RawType = RawType>(value: string): ValueType<T> => {
  estValide(value);
  return bind(value);
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutChangementPuissanceInvalideError(value);
  }
}

export const accordé = convertirEnValueType<'accordé'>('accordé');
export const annulé = convertirEnValueType<'annulé'>('annulé');
export const demandé = convertirEnValueType<'demandé'>('demandé');
export const rejeté = convertirEnValueType<'rejeté'>('rejeté');
export const informationEnregistrée =
  convertirEnValueType<'information-enregistrée'>('information-enregistrée');

class StatutChangementPuissanceInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class ChangementPuissanceDéjàAccordéeErreur extends InvalidOperationError {
  constructor() {
    super(`La demande de changement de puissance a déjà été accordée`);
  }
}

class ChangementPuissanceDéjàRejetéeErreur extends InvalidOperationError {
  constructor() {
    super(`La demande de changement de puissance a déjà été rejetée`);
  }
}

class ChangementPuissanceDéjàAnnuléeErreur extends InvalidOperationError {
  constructor() {
    super(`La demande de changement de puissance a déjà été annulée`);
  }
}

class ChangementPuissanceDéjàEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande de changement est déjà en cours`);
  }
}

class AucuneDemandeDeChangementEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de changement n'est en cours`);
  }
}
