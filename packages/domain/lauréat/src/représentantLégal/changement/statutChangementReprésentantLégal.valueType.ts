import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const statuts = ['accordé', 'demandé', 'rejeté'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  formatter(): RawType;
  estDemandé: () => boolean;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
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
    vérifierQueLeChangementDeStatutEstPossibleEn(nouveauStatut: ValueType) {
      if (nouveauStatut.estDemandé() && this.estDemandé()) {
        throw new DemandeChangementDéjàDemandéeError();
      }
      if (nouveauStatut.estAccordé() && this.estAccordé()) {
        throw new DemandeChangementInexistanteError();
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
export const accordé = convertirEnValueType('accordé');
export const rejeté = convertirEnValueType('rejeté');

class StatutChangementReprésentantLégalInvalideError extends InvalidOperationError {
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

class DemandeChangementInexistanteError extends InvalidOperationError {
  constructor() {
    super(`Aucun changement de représentant légal n'est en cours`);
  }
}
