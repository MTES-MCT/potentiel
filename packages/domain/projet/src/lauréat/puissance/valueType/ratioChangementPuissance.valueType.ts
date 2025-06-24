import { InvalidOperationError, PlainType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Candidature, Lauréat } from '../../..';
import { VolumeRéservé } from '../../../candidature';

import { getRatiosChangementPuissance } from './helpers';

export type RawType = number;

export type ValueType = {
  puissanceInitiale: number;
  nouvellePuissance: number;
  ratiosCdcActuel: { min: number; max: number };
  ratiosCdcInitial: { min: number; max: number };
  puissanceMaxFamille?: number;
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
  ratiosCdcActuel,
  ratiosCdcInitial,
  puissanceMaxFamille,
}: PlainType<Omit<ValueType, 'ratio'>>): ValueType => {
  return {
    ratiosCdcActuel,
    ratiosCdcInitial,
    puissanceMaxFamille,
    nouvellePuissance,
    puissanceInitiale,
    get volumeRéservé() {
      return volumeRéservé ? VolumeRéservé.bind(volumeRéservé) : undefined;
    },
    get ratio() {
      return this.nouvellePuissance / puissanceInitiale;
    },
    dépasseRatiosChangementPuissance() {
      return this.ratio < this.ratiosCdcActuel.min || this.ratio > this.ratiosCdcActuel.max;
    },
    dépasseRatiosChangementPuissanceDuCahierDesChargesInitial() {
      return this.ratio < this.ratiosCdcInitial.min || this.ratio > this.ratiosCdcInitial.max;
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
      // ordre des erreurs suit celui du legacy
      if (this.dépassePuissanceMaxFamille()) {
        throw new PuissanceDépassePuissanceMaxFamille();
      }

      if (this.dépassePuissanceMaxDuVolumeRéservé()) {
        throw new PuissanceDépasseVolumeRéservéAO();
      }

      if (typeDemande === 'information-enregistrée') {
        if (this.ratio > this.ratiosCdcActuel.max) {
          throw new PuissanceDépassePuissanceMaxAO();
        }

        if (this.ratio < this.ratiosCdcActuel.min) {
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
  const ratiosCdcActuel = getRatiosChangementPuissance({
    appelOffre,
    technologie,
    cahierDesCharges,
  });

  const ratiosCdcInitial = getRatiosChangementPuissance({
    appelOffre,
    technologie,
    cahierDesCharges: { type: 'initial' },
  });

  return bind({
    nouvellePuissance,
    puissanceInitiale,
    ratiosCdcActuel,
    ratiosCdcInitial,
    puissanceMaxFamille: famille?.puissanceMax,
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
