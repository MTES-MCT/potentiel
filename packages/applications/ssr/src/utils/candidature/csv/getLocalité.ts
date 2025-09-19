import { Candidature } from '@potentiel-domain/projet';
import {
  DépartementRégion,
  récupérerDépartementRégionParCodePostal,
} from '@potentiel-domain/inmemory-referential';

type GetLocalité = (
  args: Record<'codePostal' | 'adresse1' | 'adresse2' | 'commune', string>,
) => Candidature.Localité.RawType;

export const getLocalité: GetLocalité = ({ codePostal, adresse1, adresse2, commune }) => {
  const codePostaux = codePostal.split('/').map((str) => str.trim());
  const départementsRégions = codePostaux
    .map(récupérerDépartementRégionParCodePostal)
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
