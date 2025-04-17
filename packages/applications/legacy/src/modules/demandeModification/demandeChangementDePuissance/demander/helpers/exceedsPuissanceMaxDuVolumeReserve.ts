import { DésignationCatégorie } from '../../../../project';
import { ProjectAppelOffre } from '../../../../../entities';
import { getVolumeReserve } from './getVolumeReserve';

export type ExceedsPuissanceMaxDuVolumeReserve = (arg: {
  project: {
    appelOffre?: ProjectAppelOffre;
    désignationCatégorie?: DésignationCatégorie;
  };
  nouvellePuissance: number;
}) => boolean;

export const exceedsPuissanceMaxDuVolumeReserve: ExceedsPuissanceMaxDuVolumeReserve = ({
  project: { désignationCatégorie, appelOffre },
  nouvellePuissance,
}) => {
  if (!désignationCatégorie) {
    return false;
  }

  // if (isNotifiedPeriode(periode)) {
  //   if (periode.noteThresholdBy === 'category') {
  //     const {
  //       noteThreshold: { volumeReserve },
  //     } = periode;

  //     return volumeReserve;
  //   }
  // }

  const volumeReserve = appelOffre && getVolumeReserve(appelOffre);
  if (volumeReserve) {
    const { puissanceMax } = volumeReserve;
    if (désignationCatégorie == 'volume-réservé' && nouvellePuissance > puissanceMax) {
      return true;
    }
  }

  return false;
};
