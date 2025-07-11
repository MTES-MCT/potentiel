import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

import { Candidature, Lauréat } from '../../../..';

const PUISSANCE_DEFAULT_RATIOS = { min: 0.9, max: 1.1 };

type GetRatiosChangementPuissanceProps = {
  appelOffre: Pick<AppelOffre.ConsulterAppelOffreReadModel, 'changementPuissance'>;
  technologie: PlainType<Candidature.TypeTechnologie.ValueType>;
  cahierDesCharges: PlainType<Lauréat.ConsulterCahierDesChargesChoisiReadModel>;
};

export const getRatiosChangementPuissance = ({
  appelOffre,
  technologie,
  cahierDesCharges,
}: GetRatiosChangementPuissanceProps) => {
  if (!appelOffre) {
    return PUISSANCE_DEFAULT_RATIOS;
  }

  // prendre les ratios du CDC 2022 si existants
  if (cahierDesCharges.type === 'modifié' && cahierDesCharges.paruLe === '30/08/2022') {
    const seuilsCDC = cahierDesCharges?.seuilSupplémentaireChangementPuissance;

    if (seuilsCDC?.changementByTechnologie) {
      if (technologie.type === 'N/A') {
        return PUISSANCE_DEFAULT_RATIOS;
      }
      return seuilsCDC.ratios[technologie.type];
    } else if (seuilsCDC) {
      return seuilsCDC.ratios;
    }
  }

  // sinon prendre les ratio du CDC initial par technologie
  const { changementPuissance } = appelOffre;

  if (changementPuissance.changementByTechnologie) {
    if (technologie.type === 'N/A') {
      return PUISSANCE_DEFAULT_RATIOS;
    }

    return changementPuissance.ratios[technologie.type];
  }

  // sinon prendre les ratios du CDC initial
  return changementPuissance.ratios;
};
