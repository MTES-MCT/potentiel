import { DomainError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';

import { ConsulterCahierDesChargesChoisiReadmodel } from '../../cahierDesChargesChoisi';

import {
  dépassePuissanceMaxDuVolumeRéservé,
  dépassePuissanceMaxFamille,
  dépasseRatiosChangementPuissance,
  getRatiosChangementPuissance,
} from './helpers';
import { récupérerVolumeRéservé } from './helpers/récupérerVolumeRéservé';

export type RawType = number;

export type ValueType = ReadonlyValueType<{
  ratio: number;
  appelOffre: PlainType<AppelOffre.ConsulterAppelOffreReadModel>;
  technologie: Candidature.TypeTechnologie.RawType;
  cahierDesCharges: PlainType<ConsulterCahierDesChargesChoisiReadmodel>;
  période: PlainType<AppelOffre.Periode>;
  nouvellePuissance: number;
  famille?: AppelOffre.Famille;
  note: number;
  vérifierQueLaDemandeEstPossible: (typeDemande: 'demande' | 'information-enregistrée') => void;
  dépasseRatiosChangementPuissance: () => { enDeçaDeMin: boolean; dépasseMax: boolean };
  dépassePuissanceMaxDuVolumeRéservé: () => boolean;
  dépassePuissanceMaxFamille: () => boolean;
  récupérerRatiosChangementPuissance: () => { minRatio: number; maxRatio: number };
  récupérerVolumeRéservéPuissanceMax: () =>
    | { noteThreshold: number; puissanceMax: number }
    | undefined;
  récupérerPuissanceMaxFamille: () => number | undefined;
}>;

export const bind = ({
  ratio,
  appelOffre,
  note,
  période,
  nouvellePuissance,
  famille,
  technologie,
  cahierDesCharges,
}: PlainType<ValueType>): ValueType => {
  return {
    get ratio() {
      return ratio;
    },
    get appelOffre() {
      return appelOffre;
    },
    get technologie() {
      return technologie;
    },
    get cahierDesCharges() {
      return cahierDesCharges;
    },
    get période() {
      return période;
    },
    get nouvellePuissance() {
      return nouvellePuissance;
    },
    get famille() {
      return famille;
    },
    get note() {
      return note;
    },
    estÉgaleÀ(valueType) {
      return this.ratio === valueType.ratio;
    },
    dépasseRatiosChangementPuissance(): { enDeçaDeMin: boolean; dépasseMax: boolean } {
      const { min, max } = getRatiosChangementPuissance({
        appelOffre: this.appelOffre,
        technologie,
        cahierDesCharges: this.cahierDesCharges,
      });
      return dépasseRatiosChangementPuissance({
        minRatio: min,
        maxRatio: max,
        ratio,
      });
    },
    dépassePuissanceMaxFamille(): boolean {
      return dépassePuissanceMaxFamille({
        famille: this.famille,
        nouvellePuissance,
      });
    },
    dépassePuissanceMaxDuVolumeRéservé(): boolean {
      return dépassePuissanceMaxDuVolumeRéservé({
        note,
        période,
        nouvellePuissance,
        puissanceActuelle: nouvellePuissance / this.ratio,
      });
    },
    récupérerRatiosChangementPuissance(): { minRatio: number; maxRatio: number } {
      const { min, max } = getRatiosChangementPuissance({
        appelOffre: this.appelOffre,
        technologie,
        cahierDesCharges: this.cahierDesCharges,
      });
      return { minRatio: min, maxRatio: max };
    },
    récupérerVolumeRéservéPuissanceMax():
      | { noteThreshold: number; puissanceMax: number }
      | undefined {
      return récupérerVolumeRéservé({ période });
    },
    récupérerPuissanceMaxFamille(): number | undefined {
      return famille?.puissanceMax;
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
        if (this.dépasseRatiosChangementPuissance().dépasseMax) {
          throw new PuissanceDépassePuissanceMaxAO();
        }

        if (this.dépasseRatiosChangementPuissance().enDeçaDeMin) {
          throw new PuissanceEnDeçaPuissanceMinAO();
        }
      }
    },
  };
};

class PuissanceDépassePuissanceMaxAO extends DomainError {
  constructor() {
    super("La puissance dépasse la puissance maximale autorisée par l'appel d'offres");
  }
}

class PuissanceEnDeçaPuissanceMinAO extends DomainError {
  constructor() {
    super("La puissance est en deça de la puissance minimale autorisée par l'appel d'offres");
  }
}

class PuissanceDépassePuissanceMaxFamille extends DomainError {
  constructor() {
    super("La puissance dépasse la puissance maximale de la famille de l'appel d'offre");
  }
}

class PuissanceDépasseVolumeRéservéAO extends DomainError {
  constructor() {
    super("La puissance dépasse le volume réservé de l'appel d'offre");
  }
}
