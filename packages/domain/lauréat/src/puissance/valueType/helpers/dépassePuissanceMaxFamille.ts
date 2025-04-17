import { AppelOffre } from '@potentiel-domain/appel-offre';

type DépassePuissanceMaxFamilleProps = {
  famille?: AppelOffre.Famille;
  nouvellePuissance: number;
};

export const dépassePuissanceMaxFamille = ({
  famille,
  nouvellePuissance,
}: DépassePuissanceMaxFamilleProps) => {
  const puissanceMaxFamille = famille?.puissanceMax;

  if (puissanceMaxFamille === undefined) {
    return false;
  }

  return nouvellePuissance > puissanceMaxFamille;
};
