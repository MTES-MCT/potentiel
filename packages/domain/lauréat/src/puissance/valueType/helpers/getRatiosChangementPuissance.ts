import { Candidature } from '@potentiel-domain/candidature';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

import { ConsulterCahierDesChargesChoisiReadmodel } from '../../../cahierDesChargesChoisi';

const defaultRatios = { min: 0.9, max: 1.1 };

export const getRatiosChangementPuissance = ({
  appelOffre,
  technologie,
  cahierDesCharges,
}: {
  appelOffre: Pick<AppelOffre.ConsulterAppelOffreReadModel, 'changementPuissance'>;
  technologie: Candidature.TypeTechnologie.RawType;
  cahierDesCharges: PlainType<ConsulterCahierDesChargesChoisiReadmodel>;
}): { min: number; max: number } => {
  if (!appelOffre) {
    return defaultRatios;
  }

  // prendre les ratios du CDC 2022 si existants
  if (cahierDesCharges.type === 'modifié' && cahierDesCharges.paruLe === '30/08/2022') {
    const seuilsCDC = cahierDesCharges?.seuilSupplémentaireChangementPuissance;

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
