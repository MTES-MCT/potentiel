import { AppelOffre } from '@potentiel-domain/appel-offre';

export type ExceedsPuissanceMaxFamille = {
  période: AppelOffre.Periode;
  familleId: string;
  nouvellePuissance: number;
};

export const exceedsPuissanceMaxFamille = ({
  période,
  familleId,
  nouvellePuissance,
}: ExceedsPuissanceMaxFamille): boolean => {
  if (!familleId) {
    return false;
  }

  const puissanceMaxFamille = période.familles.find((f) => f.id === familleId)?.puissanceMax;

  if (!puissanceMaxFamille) {
    return false;
  }

  return nouvellePuissance > puissanceMaxFamille;
};
