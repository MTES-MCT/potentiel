import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

export const dépassePuissanceMaxDuVolumeRéservé = ({
  période,
  nouvellePuissance,
  note,
}: {
  note: number;
  nouvellePuissance: number;
  période: PlainType<AppelOffre.Periode>;
}): boolean => {
  if (période.noteThresholdBy !== 'category') return false;
  const isVolumeReservé =
    nouvellePuissance <= période.noteThreshold.volumeReserve.puissanceMax &&
    note >= période.noteThreshold.volumeReserve.noteThreshold;
  const {
    noteThreshold: { volumeReserve },
  } = période;

  if (volumeReserve) {
    const { puissanceMax } = volumeReserve;
    if (isVolumeReservé) {
      return nouvellePuissance > puissanceMax;
    }
  }

  return false;
};
