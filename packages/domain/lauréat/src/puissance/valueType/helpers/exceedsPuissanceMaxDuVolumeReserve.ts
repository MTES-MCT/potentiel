import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getVolumeReserve } from './getVolumeReserve';
import { getDésignationCatégorie } from './getDesignationCategorie';

export type ExceedsPuissanceMaxDuVolumeReserve = {
  note: number;
  nouvellePuissance: number;
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
  périodeId: string;
};

export const exceedsPuissanceMaxDuVolumeReserve = ({
  note,
  périodeId,
  nouvellePuissance,
  appelOffre,
}: ExceedsPuissanceMaxDuVolumeReserve): boolean => {
  const période = appelOffre.periodes.find((p) => p.id === périodeId);

  if (!période) {
    return false;
  }

  const désignationCatégorie = getDésignationCatégorie({
    puissance: nouvellePuissance,
    note,
    periodeDetails: période,
  });

  if (!désignationCatégorie) {
    return false;
  }

  const volumeReserve = appelOffre && getVolumeReserve({ appelOffre, périodeId });
  if (volumeReserve) {
    const { puissanceMax } = volumeReserve;
    if (désignationCatégorie == 'volume-réservé' && nouvellePuissance > puissanceMax) {
      return true;
    }
  }

  return false;
};
