import { AppelOffre } from '@potentiel-domain/appel-offre';

type DépassePuissanceMaxFamilleProps = {
  famille?: Pick<AppelOffre.Famille, 'puissanceMax'>;
  nouvellePuissance: number;
};

export const dépassePuissanceMaxFamille = ({
  famille,
  nouvellePuissance,
}: DépassePuissanceMaxFamilleProps) => {
  const puissanceMaxFamille = famille?.puissanceMax;

  if (!puissanceMaxFamille) {
    return false;
  }

  return nouvellePuissance > puissanceMaxFamille;
};
