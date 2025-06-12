import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Candidature, Lauréat } from '../../..';

import {
  dépassePuissanceMaxDuVolumeRéservé,
  dépassePuissanceMaxFamille,
  dépasseRatiosChangementPuissance,
  getRatiosChangementPuissance,
} from './helpers';
import { récupérerPuissanceMaxVolumeRéservé } from './helpers/récupérerPuissanceMaxVolumeRéservé';

export type RawType = number;

export type ValueType = ReadonlyValueType<{
  ratio: number;
  appelOffre: PlainType<AppelOffre.ConsulterAppelOffreReadModel>;
  technologie: Candidature.TypeTechnologie.RawType;
  cahierDesCharges: PlainType<Lauréat.ConsulterCahierDesChargesChoisiReadModel>;
  période: PlainType<AppelOffre.Periode>;
  nouvellePuissance: number;
  famille?: AppelOffre.Famille;
  note: number;
  vérifierQueLaDemandeEstPossible: (typeDemande: 'demande' | 'information-enregistrée') => void;
  dépasseRatiosChangementPuissance: () => ReturnType<typeof dépasseRatiosChangementPuissance>;
  dépassePuissanceMaxDuVolumeRéservé: () => ReturnType<typeof dépassePuissanceMaxDuVolumeRéservé>;
  dépassePuissanceMaxFamille: () => ReturnType<typeof dépassePuissanceMaxFamille>;
  dépasseRatiosChangementPuissanceDuCahierDesChargesInitial: () => boolean;
  récupérerRatiosChangementPuissance: () => { minRatio: number; maxRatio: number };
  récupérerPuissanceMaxVolumeRéservé: () => ReturnType<typeof récupérerPuissanceMaxVolumeRéservé>;
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
    dépasseRatiosChangementPuissance() {
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
    dépasseRatiosChangementPuissanceDuCahierDesChargesInitial() {
      const { min, max } = getRatiosChangementPuissance({
        appelOffre: this.appelOffre,
        technologie,
        cahierDesCharges: { type: 'initial' },
      });
      const { dépasseMax, enDeçaDeMin } = dépasseRatiosChangementPuissance({
        minRatio: min,
        maxRatio: max,
        ratio,
      });
      return dépasseMax || enDeçaDeMin;
    },
    dépassePuissanceMaxFamille() {
      return dépassePuissanceMaxFamille({
        famille: this.famille,
        nouvellePuissance,
      });
    },
    dépassePuissanceMaxDuVolumeRéservé() {
      return dépassePuissanceMaxDuVolumeRéservé({
        note,
        période,
        nouvellePuissance,
        puissanceActuelle: nouvellePuissance / this.ratio,
      });
    },
    récupérerRatiosChangementPuissance() {
      const { min, max } = getRatiosChangementPuissance({
        appelOffre: this.appelOffre,
        technologie,
        cahierDesCharges: this.cahierDesCharges,
      });
      return { minRatio: min, maxRatio: max };
    },
    récupérerPuissanceMaxVolumeRéservé() {
      return récupérerPuissanceMaxVolumeRéservé({ période });
    },
    récupérerPuissanceMaxFamille() {
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
