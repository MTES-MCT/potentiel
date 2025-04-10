import { AppelOffre } from '@potentiel-domain/appel-offre';

export const dépassePuissanceMaxFamille = ({
  appelOffre,
  périodeId,
  familleId,
  nouvellePuissance,
}: {
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
  périodeId: string;
  familleId: string;
  nouvellePuissance: number;
}): boolean => {
  const période = appelOffre.periodes.find((p) => p.id === périodeId);

  if (!période || !familleId) {
    return false;
  }

  const puissanceMaxFamille = période.familles.find((f) => f.id === familleId)?.puissanceMax;

  if (!puissanceMaxFamille) {
    return false;
  }

  return nouvellePuissance > puissanceMaxFamille;
};
