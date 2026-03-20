import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

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

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  statut: Type;
  formatter: () => Type;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estAnnulé: () => boolean;
  estDemandé: () => boolean;
  estEnCours: () => boolean;
  estEnInstruction: () => boolean;
  vérifierQueLeChangementDeStatutEstPossibleEn: (nouveauStatut: ValueType) => void;
}>;

export const bind = <Type extends RawType = RawType>({
  statut,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(statut);
  return {
    get statut() {
      return statut as Type;
    },
    formatter() {
      return this.statut;
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
    estEnInstruction() {
      return this.statut === 'en-instruction';
    },
    estEnCours() {
      return statutsEnCours.includes(this.statut);
    },
    estÉgaleÀ(valueType) {
      return this.statut === valueType.statut;
    },
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (nouveauStatut.estAccordé()) {
        if (this.estAccordé()) {
          throw new RecoursDéjàAccordéError();
        }
        if (this.estAnnulé()) {
          throw new RecoursDéjàAnnuléError();
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

        if (this.estAnnulé()) {
          throw new RecoursDéjàAnnuléError();
        }
      } else if (nouveauStatut.estEnInstruction()) {
        if (this.estAccordé()) {
          throw new RecoursDéjàAccordéError();
        }

        if (this.estRejeté()) {
          throw new RecoursDéjàRejetéError();
        }

        if (this.estAnnulé()) {
          throw new RecoursDéjàAnnuléError();
        }
      }
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(statut: string): ValueType => {
  estValide(statut);
  return bind<Type>({
    statut,
  });
};

function estValide(value: string): asserts value is RawType {
  const isValid = statuts.includes(value as RawType);

  if (!isValid) {
    throw new StatutRecoursInvalideError(value);
  }
}

export const accordé = convertirEnValueType<'accordé'>('accordé');
export const annulé = convertirEnValueType<'annulé'>('annulé');
export const demandé = convertirEnValueType<'demandé'>('demandé');
export const rejeté = convertirEnValueType<'rejeté'>('rejeté');
export const enInstruction = convertirEnValueType<'en-instruction'>('en-instruction');
export const inconnu = convertirEnValueType<'inconnu'>('inconnu');

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
