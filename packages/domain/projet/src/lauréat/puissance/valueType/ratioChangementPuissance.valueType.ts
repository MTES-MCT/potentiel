import { InvalidOperationError, PlainType } from '@potentiel-domain/core';

import { VolumeRéservé } from '../index.js';

export type RawType = number;

export type ValueType = {
  puissanceInitiale: number;
  nouvellePuissance: number;
  ratios: { min: number; max: number };
  puissanceMaxFamille: number | undefined;
  volumeRéservé: VolumeRéservé.ValueType | undefined;
  vérifierQueLaDemandeEstPossible: (typeDemande: 'demande' | 'information-enregistrée') => void;
  vérifierQueLaDécisionDÉtatEstPossible: () => void;
  dépasseRatiosChangementPuissance: () => boolean;
  dépassePuissanceMaxDuVolumeRéservé: () => boolean;
  dépassePuissanceMaxFamille: () => boolean;
};

export const bind = ({
  nouvellePuissance,
  puissanceInitiale,
  volumeRéservé,
  ratios: ratiosCdcActuel,
  puissanceMaxFamille,
}: PlainType<ValueType>): ValueType => {
  const ratio = nouvellePuissance / puissanceInitiale;
  return {
    ratios: ratiosCdcActuel,
    puissanceMaxFamille,
    nouvellePuissance,
    puissanceInitiale,
    volumeRéservé: volumeRéservé ? VolumeRéservé.bind(volumeRéservé) : undefined,
    dépasseRatiosChangementPuissance() {
      return ratio < this.ratios.min || ratio > this.ratios.max;
    },

    dépassePuissanceMaxFamille() {
      return this.puissanceMaxFamille !== undefined
        ? this.nouvellePuissance > this.puissanceMaxFamille
        : false;
    },
    dépassePuissanceMaxDuVolumeRéservé() {
      return this.volumeRéservé?.dépassePuissanceMax(this.nouvellePuissance) ?? false;
    },
    vérifierQueLaDemandeEstPossible(typeDemande: 'demande' | 'information-enregistrée') {
      if (this.dépassePuissanceMaxFamille()) {
        throw new PuissanceDépassePuissanceMaxFamille();
      }

      if (this.dépassePuissanceMaxDuVolumeRéservé()) {
        throw new PuissanceDépasseVolumeRéservéAO();
      }

      if (typeDemande === 'information-enregistrée') {
        if (ratio > this.ratios.max) {
          throw new PuissanceDépassePuissanceMaxAO();
        }

        if (ratio < this.ratios.min) {
          throw new PuissanceEnDeçaPuissanceMinAO();
        }
      }
    },
    vérifierQueLaDécisionDÉtatEstPossible() {
      if (ratio > 1) {
        throw new DécisionDÉtatPourChangementÀLaHausseError();
      }
    },
  };
};

class PuissanceDépassePuissanceMaxAO extends InvalidOperationError {
  constructor() {
    super(
      "La nouvelle puissance ne peut dépasser la puissance maximale autorisée par l'appel d'offres",
    );
  }
}

class PuissanceEnDeçaPuissanceMinAO extends InvalidOperationError {
  constructor() {
    super(
      "La puissance ne peut être en deça de la puissance minimale autorisée par l'appel d'offres",
    );
  }
}

class PuissanceDépassePuissanceMaxFamille extends InvalidOperationError {
  constructor() {
    super(
      "La nouvelle puissance ne peut pas dépasser la puissance maximale de la famille de l'appel d'offres",
    );
  }
}

class PuissanceDépasseVolumeRéservéAO extends InvalidOperationError {
  constructor() {
    super('La nouvelle puissance ne peut pas dépasser la puissance maximale du volume réservé');
  }
}

class DécisionDÉtatPourChangementÀLaHausseError extends InvalidOperationError {
  constructor() {
    super("Un changement de puissance à la hausse ne peut être une décision de l'État");
  }
}
