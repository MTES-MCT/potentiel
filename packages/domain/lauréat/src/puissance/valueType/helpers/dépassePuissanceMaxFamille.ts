import { AppelOffre } from '@potentiel-domain/appel-offre';

export const dépassePuissanceMaxFamille = ({
  famille,
  nouvellePuissance,
}: {
  famille: Pick<AppelOffre.Famille, 'puissanceMax'> | undefined;
  nouvellePuissance: number;
}): boolean => {
  const puissanceMaxFamille = famille?.puissanceMax;

  if (!puissanceMaxFamille) {
    return false;
  }

  return nouvellePuissance > puissanceMaxFamille;
};
