import { Candidature } from '@potentiel-domain/projet';

import { CandidatureShape } from '@/utils/zod/candidature';

import {
  DépartementRégion,
  getRégionAndDépartementFromCodePostal,
} from './getRégionAndDépartementFromCodePostal';

export const getLocalité = ({
  codePostaux,
  adresse1,
  adresse2,
  commune,
}: Pick<
  CandidatureShape,
  'codePostaux' | 'adresse1' | 'adresse2' | 'commune'
>): Candidature.ImporterCandidatureUseCase['data']['localitéValue'] => {
  const départementsRégions = codePostaux
    .map(getRégionAndDépartementFromCodePostal)
    .filter((dptRegion): dptRegion is DépartementRégion => !!dptRegion);
  const departements = Array.from(new Set(départementsRégions.map((x) => x.département)));
  const régions = Array.from(new Set(départementsRégions.map((x) => x.région)));

  return {
    adresse1,
    adresse2,
    commune,
    codePostal: codePostaux.join(' / '),
    département: departements.join(' / '),
    région: régions.join(' / '),
  };
};
