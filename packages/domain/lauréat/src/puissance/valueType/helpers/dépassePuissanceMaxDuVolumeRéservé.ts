import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

import { récupérerPuissanceMaxVolumeRéservé } from './récupérerPuissanceMaxVolumeRéservé';

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
  const désignationCatégorie = getDésignationCatégorie({
    puissanceActuelle,
    note,
    période,
  });

  if (désignationCatégorie !== 'volume-réservé') {
    return false;
  }

  const puissanceMaxVolumeReservé = récupérerPuissanceMaxVolumeRéservé({ période });

  if (puissanceMaxVolumeReservé === undefined) {
    return false;
  }

  return nouvellePuissance > puissanceMaxVolumeReservé;
};

type GetDésignationCatégorieProps = Omit<
  DépassePuissanceMaxDuVolumeRéservéProps,
  'nouvellePuissance'
>;

export const getDésignationCatégorie = ({
  puissanceActuelle,
  note,
  période,
}: GetDésignationCatégorieProps) => {
  if (période.noteThresholdBy !== 'category') {
    return undefined;
  }

  return puissanceActuelle <= période.noteThreshold.volumeReserve.puissanceMax &&
    note >= période.noteThreshold.volumeReserve.noteThreshold
    ? 'volume-réservé'
    : 'hors-volume-réservé';
};
