import { Candidature } from '@potentiel-domain/projet';

import { CandidatureShape } from '@/utils/candidature';

import {
  DépartementRégion,
  getRégionAndDépartementFromCodePostal,
} from './getRégionAndDépartementFromCodePostal';

type GetLocalité = (
  args: Pick<CandidatureShape, 'codePostaux' | 'adresse1' | 'adresse2' | 'commune'>,
) => Candidature.Localité.RawType;

export const getLocalité: GetLocalité = ({ codePostaux, adresse1, adresse2, commune }) => {
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
