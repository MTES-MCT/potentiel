import { match } from 'ts-pattern';

import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { DemandeDeChangementEnCoursError } from './errors.js';

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
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estAnnulé: () => boolean;
  estDemandé: () => boolean;
  estInformationEnregistrée: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const bind = ({ statut }: PlainType<ValueType>): ValueType => {
  estValide(statut);
  return {
    get statut() {
      return statut;
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
        if (nouveauStatut.statut === 'demandé') {
          throw new DemandeDeChangementEnCoursError();
        }
        if (nouveauStatut.statut === 'information-enregistrée') {
          throw new DemandeDeChangementEnCoursError();
        }
      } else if (nouveauStatut.statut !== 'demandé') {
        const error = match(this.statut)
          .with('accordé', () => new ChangementActionnaireDéjàAccordéeErreur())
          .with('annulé', () => new ChangementActionnaireDéjàAnnuléeErreur())
          .with('rejeté', () => new ChangementActionnaireDéjàRejetéeErreur())
          .exhaustive();
        throw error;
      }
      return;
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
    throw new StatutChangementActionnaireInvalideError(value);
  }
}

export const accordé = convertirEnValueType('accordé');
export const annulé = convertirEnValueType('annulé');
export const demandé = convertirEnValueType('demandé');
export const rejeté = convertirEnValueType('rejeté');
export const informationEnregistrée = convertirEnValueType('information-enregistrée');

class StatutChangementActionnaireInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class ChangementActionnaireDéjàAccordéeErreur extends InvalidOperationError {
  constructor() {
    super(`La demande de changement d'actionnaire a déjà été accordée`);
  }
}

class ChangementActionnaireDéjàRejetéeErreur extends InvalidOperationError {
  constructor() {
    super(`La demande de changement d'actionnaire a déjà été rejetée`);
  }
}

class ChangementActionnaireDéjàAnnuléeErreur extends InvalidOperationError {
  constructor() {
    super(`La demande de changement d'actionnaire a déjà été annulée`);
  }
}

class AucuneDemandeDeChangementEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de changement n'est en cours`);
  }
}
