import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = [
  'accordé',
  'annulé',
  'demandé',
  'rejeté',
  'en-instruction',
  'inconnu',
] as const;

export type RawType = (typeof statuts)[number];

export const statutsEnCours: Array<RawType> = ['demandé', 'en-instruction'];

export type ValueType = ReadonlyValueType<{
  value: RawType;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estAnnulé: () => boolean;
  estDemandé: () => boolean;
  estEnCours: () => boolean;
  estEnInstruction: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get value() {
      return value;
    },
    estAccordé() {
      return this.value === 'accordé';
    },
    estRejeté() {
      return this.value === 'rejeté';
    },
    estAnnulé() {
      return this.value === 'annulé';
    },
    estDemandé() {
      return this.value === 'demandé';
    },
    estEnInstruction() {
      return this.value === 'en-instruction';
    },
    estEnCours() {
      return statutsEnCours.includes(this.value);
    },
    estÉgaleÀ(valueType) {
      return this.value === valueType.value;
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (nouveauStatut.estAccordé()) {
        if (this.estAccordé()) {
          throw new RecoursDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new RecoursDéjàRejetéError();
        }
      } else if (nouveauStatut.estAnnulé()) {
        if (this.estAnnulé()) {
          throw new RecoursDéjàAnnuléError();
        }
        if (this.estAccordé()) {
          throw new RecoursDéjàAccordéError();
        }
        if (this.estRejeté()) {
          throw new RecoursDéjàRejetéError();
        }
      } else if (nouveauStatut.estDemandé()) {
        if (this.estAccordé()) {
          throw new RecoursDéjàAccordéError();
        }

        if (this.estEnCours()) {
          throw new RecoursEnCoursErreur();
        }
      } else if (nouveauStatut.estRejeté()) {
        if (this.estAccordé()) {
          throw new RecoursDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new RecoursDéjàRejetéError();
        }
      } else if (nouveauStatut.estEnInstruction()) {
        if (this.estAccordé()) {
          throw new RecoursDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new RecoursDéjàRejetéError();
        }
      }
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutRecoursInvalideError(value);
  }
}

export const accordé = convertirEnValueType('accordé');
export const annulé = convertirEnValueType('annulé');
export const demandé = convertirEnValueType('demandé');
export const rejeté = convertirEnValueType('rejeté');
export const enInstruction = convertirEnValueType('en-instruction');
export const inconnu = convertirEnValueType('inconnu');

class StatutRecoursInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class RecoursDéjàAccordéError extends InvalidOperationError {
  constructor() {
    super(`Le recours a déjà été accordé`);
  }
}

class RecoursDéjàRejetéError extends InvalidOperationError {
  constructor() {
    super(`Le recours a déjà été rejeté`);
  }
}

class RecoursEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Un recours est déjà en cours`);
  }
}

class RecoursDéjàAnnuléError extends InvalidOperationError {
  constructor() {
    super(`Le recours a déjà été annulé`);
  }
}
