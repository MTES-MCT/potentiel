import { Candidature } from '@potentiel-domain/candidature';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ConsulterCahierDesChargesChoisiReadmodel } from '../../../cahierDesChargesChoisi';

const defaultRatios = { min: 0.9, max: 1.1 };

export type GetRatiosChangementPuissance = {
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
  technologie: Candidature.TypeTechnologie.RawType;
  cahierDesCharges: ConsulterCahierDesChargesChoisiReadmodel;
  période: string;
};

export const getRatiosChangementPuissance = ({
  appelOffre,
  technologie,
  cahierDesCharges,
  période,
}: GetRatiosChangementPuissance): { min: number; max: number } => {
  if (!appelOffre) {
    return defaultRatios;
  }

  // prendre les ratios du CDC 2022 si existants
  if (cahierDesCharges.type === 'modifié' && cahierDesCharges.paruLe === '30/08/2022') {
    const détailCDC = appelOffre.periodes
      .find((p) => p.id === période)
      ?.cahiersDesChargesModifiésDisponibles.find(
        (cdc) =>
          cdc.type === 'modifié' &&
          cdc.paruLe === '30/08/2022' &&
          cdc.alternatif === cahierDesCharges.alternatif,
      );

    const seuilsCDC = détailCDC?.seuilSupplémentaireChangementPuissance;

    if (seuilsCDC?.changementByTechnologie) {
      if (technologie === 'N/A') {
        return defaultRatios;
      }
      return seuilsCDC.ratios[technologie];
    } else if (seuilsCDC) {
      return seuilsCDC.ratios;
    }
  }

  // sinon prendre les ratio du CDC initial par technologie
  const { changementPuissance } = appelOffre;

  if (changementPuissance.changementByTechnologie) {
    if (technologie === 'N/A') {
      return defaultRatios;
    }

    return changementPuissance.ratios[technologie];
  }
  // sinon prendre les ratios du CDC initial
  return changementPuissance.ratios;
};
