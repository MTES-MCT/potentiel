import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

import { récupérerVolumeRéservé } from './récupérerVolumeRéservé';

type DépassePuissanceMaxDuVolumeRéservéProps = {
  note: number;
  nouvellePuissance: number;
  puissanceActuelle: number;
  période: PlainType<AppelOffre.Periode>;
};

export const dépassePuissanceMaxDuVolumeRéservé = ({
  période,
  nouvellePuissance,
  puissanceActuelle,
  note,
}: DépassePuissanceMaxDuVolumeRéservéProps) => {
  if (période.noteThresholdBy !== 'category') return false;

  const désignationCatégorie =
    puissanceActuelle <= période.noteThreshold.volumeReserve.puissanceMax &&
    note >= période.noteThreshold.volumeReserve.noteThreshold
      ? 'volume-réservé'
      : 'hors-volume-réservé';

  const volumeReservé = récupérerVolumeRéservé({ période });

  if (volumeReservé) {
    const { puissanceMax } = volumeReservé;
    if (désignationCatégorie == 'volume-réservé' && nouvellePuissance > puissanceMax) {
      return true;
    }
  }

  return false;
};
