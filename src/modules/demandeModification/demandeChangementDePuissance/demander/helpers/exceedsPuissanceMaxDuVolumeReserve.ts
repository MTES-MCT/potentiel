import { ProjectAppelOffre } from '../../../../../entities';
import { getVolumeReserve } from './getVolumeReserve';

export type ExceedsPuissanceMaxDuVolumeReserve = (arg: {
  project: {
    puissanceInitiale: number;
    note: number;
    appelOffre?: ProjectAppelOffre;
  };
  nouvellePuissance: number;
}) => boolean;

export const exceedsPuissanceMaxDuVolumeReserve: ExceedsPuissanceMaxDuVolumeReserve = ({
  project,
  nouvellePuissance,
}) => {
  const { appelOffre, puissanceInitiale, note } = project;
  const volumeReserve = appelOffre && getVolumeReserve(appelOffre);

  if (volumeReserve) {
    const { puissanceMax, noteThreshold } = volumeReserve;
    const wasNotifiedOnVolumeReserve = puissanceInitiale <= puissanceMax && note >= noteThreshold;
    if (wasNotifiedOnVolumeReserve && nouvellePuissance > puissanceMax) {
      return true;
    }
  }

  return false;
};
