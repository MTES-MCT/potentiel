import { Candidature } from '@potentiel-domain/projet';
import {
  DépartementRégionCP,
  récupérerDépartementRégionParCodePostal,
} from '@potentiel-domain/inmemory-referential';

import { CandidatureShape } from '@/utils/candidature';

type GetLocalité = (
  args: Pick<CandidatureShape, 'codePostaux' | 'adresse1' | 'adresse2' | 'commune'>,
) => Candidature.Localité.RawType;

export const getLocalité: GetLocalité = ({ codePostaux, adresse1, adresse2, commune }) => {
  const départementsRégions = codePostaux
    .map(récupérerDépartementRégionParCodePostal)
    .filter((dptRegion): dptRegion is DépartementRégionCP => !!dptRegion);
  const departements = Array.from(new Set(départementsRégions.map((x) => x.département)));
  const régions = Array.from(new Set(départementsRégions.map((x) => x.région)));
  const codePostauxNormalisés = Array.from(new Set(départementsRégions.map((x) => x.codePostal)));

  return {
    adresse1,
    adresse2,
    commune,
    codePostal: codePostauxNormalisés.join(' / '),
    département: departements.join(' / '),
    région: régions.join(' / '),
  };
};
