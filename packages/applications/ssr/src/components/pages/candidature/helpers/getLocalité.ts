import { Candidature } from '@potentiel-domain/candidature';

import { CandidatureShape } from '../importer/candidature.schema';

import {
  DépartementRégion,
  getRégionAndDépartementFromCodePostal,
} from './getRégionAndDépartementFromCodePostal';

export const getLocalité = ({
  code_postaux,
  adresse1,
  adresse2,
  commune,
}: CandidatureShape): Candidature.ImporterCandidatureUseCase['data']['localitéValue'] => {
  const départementsRégions = code_postaux
    .map(getRégionAndDépartementFromCodePostal)
    .filter((dptRegion): dptRegion is DépartementRégion => !!dptRegion);
  const departements = Array.from(new Set(départementsRégions.map((x) => x.département)));
  const régions = Array.from(new Set(départementsRégions.map((x) => x.région)));

  return {
    adresse1,
    adresse2,
    commune,
    codePostal: code_postaux.join(' / '),
    département: departements.join(' / '),
    région: régions.join(' / '),
  };
};
