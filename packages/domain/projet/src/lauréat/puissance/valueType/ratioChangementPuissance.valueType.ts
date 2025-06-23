import { InvalidOperationError, PlainType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Candidature, Lauréat } from '../../..';
import { VolumeRéservé } from '../../../candidature';

import { getRatiosChangementPuissance } from './helpers';

export type RawType = number;

export type ValueType = {
  puissanceInitiale: number;
  nouvellePuissance: number;
  cdcActuel: { ratioMin: number; ratioMax: number };
  cdcInitial: { ratioMin: number; ratioMax: number };
  famille?: { puissanceMax: number };
  volumeRéservé?: VolumeRéservé.ValueType;
  ratio: number;
  vérifierQueLaDemandeEstPossible: (typeDemande: 'demande' | 'information-enregistrée') => void;
  dépasseRatiosChangementPuissance: () => boolean;
  dépassePuissanceMaxDuVolumeRéservé: () => boolean;
  dépassePuissanceMaxFamille: () => boolean;
  dépasseRatiosChangementPuissanceDuCahierDesChargesInitial: () => boolean;
};

export const bind = ({
  nouvellePuissance,
  puissanceInitiale,
  volumeRéservé,
  cdcActuel,
  cdcInitial,
  famille,
}: PlainType<Omit<ValueType, 'ratio'>>): ValueType => {
  return {
    cdcActuel,
    cdcInitial,
    famille,
    nouvellePuissance,
    puissanceInitiale,
    get volumeRéservé() {
      return volumeRéservé ? VolumeRéservé.bind(volumeRéservé) : undefined;
    },
    get ratio() {
      return this.nouvellePuissance / puissanceInitiale;
    },
    dépasseRatiosChangementPuissance() {
      return this.ratio < this.cdcActuel.ratioMin || this.ratio > this.cdcActuel.ratioMax;
    },
    dépasseRatiosChangementPuissanceDuCahierDesChargesInitial() {
      return this.ratio < this.cdcInitial.ratioMin || this.ratio > this.cdcInitial.ratioMax;
    },
    dépassePuissanceMaxFamille() {
      return this.famille ? this.nouvellePuissance > this.famille.puissanceMax : false;
    },
    dépassePuissanceMaxDuVolumeRéservé() {
      return this.volumeRéservé?.dépassePuissanceMax(this.nouvellePuissance) ?? false;
    },
    vérifierQueLaDemandeEstPossible(typeDemande: 'demande' | 'information-enregistrée') {
      // ordre des erreurs suit celui du legacy
      if (this.dépassePuissanceMaxFamille()) {
        throw new PuissanceDépassePuissanceMaxFamille();
      }

      if (this.dépassePuissanceMaxDuVolumeRéservé()) {
        throw new PuissanceDépasseVolumeRéservéAO();
      }

      if (typeDemande === 'information-enregistrée') {
        if (this.ratio > this.cdcActuel.ratioMax) {
          throw new PuissanceDépassePuissanceMaxAO();
        }

        if (this.ratio < this.cdcActuel.ratioMin) {
          throw new PuissanceEnDeçaPuissanceMinAO();
        }
      }
    },
  };
};

type DéterminerProps = {
  appelOffre: PlainType<AppelOffre.ConsulterAppelOffreReadModel>;
  famille?: PlainType<AppelOffre.Famille>;
  cahierDesCharges: PlainType<Lauréat.ConsulterCahierDesChargesChoisiReadModel>;
  technologie: PlainType<Candidature.TypeTechnologie.ValueType>;
  puissanceInitiale: number;
  nouvellePuissance: number;
  volumeRéservé?: PlainType<Candidature.VolumeRéservé.ValueType>;
};

export const déterminer = ({
  appelOffre,
  famille,
  technologie,
  cahierDesCharges,
  nouvellePuissance,
  puissanceInitiale,
  volumeRéservé,
}: DéterminerProps): ValueType => {
  const cdcActuel = getRatiosChangementPuissance({
    appelOffre,
    technologie,
    cahierDesCharges,
  });

  const cdcInitial = getRatiosChangementPuissance({
    appelOffre,
    technologie,
    cahierDesCharges: { type: 'initial' },
  });

  return bind({
    nouvellePuissance,
    puissanceInitiale,
    cdcActuel: { ratioMin: cdcActuel.min, ratioMax: cdcActuel.max },
    cdcInitial: {
      ratioMin: cdcInitial.min,
      ratioMax: cdcInitial.max,
    },
    famille: famille?.puissanceMax ? { puissanceMax: famille.puissanceMax } : undefined,
    volumeRéservé: volumeRéservé && VolumeRéservé.bind(volumeRéservé),
  });
};

class PuissanceDépassePuissanceMaxAO extends InvalidOperationError {
  constructor() {
    super(
      "La nouvelle puissance ne peut dépasser la puissance maximale autorisée par l'appel d'offre",
    );
  }
}

class PuissanceEnDeçaPuissanceMinAO extends InvalidOperationError {
  constructor() {
    super(
      "La puissance ne peut être en deça de la puissance minimale autorisée par l'appel d'offre",
    );
  }
}

class PuissanceDépassePuissanceMaxFamille extends InvalidOperationError {
  constructor() {
    super(
      "La nouvelle puissance ne peut pas dépasser la puissance maximale de la famille de l'appel d'offre",
    );
  }
}

class PuissanceDépasseVolumeRéservéAO extends InvalidOperationError {
  constructor() {
    super('La nouvelle puissance ne peut pas dépasser la puissance maximale du volume réservé');
  }
}
