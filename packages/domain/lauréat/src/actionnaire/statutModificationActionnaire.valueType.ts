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
      if (nouveauStatut.estÉgaleÀ(convertirEnValueType(this.statut))) {
        throw new ModificationActionnaireAvecLeMêmeStatutErreur();
      }
      if (nouveauStatut.estAnnulé() && !this.estEnCours) {
        throw new ModificationActionnaireInexistanteErreur();
      }
      if (nouveauStatut.estAccordé() || nouveauStatut.estRejeté()) {
        if (!this.estEnCours() || this.estAnnulé()) {
          throw new ModificationActionnaireInexistanteErreur();
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

class ModificationActionnaireAvecLeMêmeStatutErreur extends InvalidOperationError {
  constructor() {
    super(`Le statut de la demande de modification est identique`);
  }
}

class ModificationActionnaireInexistanteErreur extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de modification n'est en cours`);
  }
}
