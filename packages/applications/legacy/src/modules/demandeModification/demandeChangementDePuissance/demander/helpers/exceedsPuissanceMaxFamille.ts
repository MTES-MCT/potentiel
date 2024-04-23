import { ProjectAppelOffre } from '../../../../../entities';

export type ExceedsPuissanceMaxFamille = (arg: {
  project: {
    appelOffre: ProjectAppelOffre;
    familleId?: string;
  };
  nouvellePuissance: number;
}) => boolean;

export const exceedsPuissanceMaxFamille: ExceedsPuissanceMaxFamille = ({
  project: { appelOffre, familleId },
  nouvellePuissance,
}) => {
  if (!familleId) {
    return false;
  }

  const puissanceMaxFamille = appelOffre.periode.familles.find(
    (f) => f.id === familleId,
  )?.puissanceMax;

  if (!puissanceMaxFamille) {
    return false;
  }
  return nouvellePuissance > puissanceMaxFamille;
};
