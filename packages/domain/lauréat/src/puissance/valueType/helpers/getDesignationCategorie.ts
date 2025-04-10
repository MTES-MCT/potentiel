import { AppelOffre } from '@potentiel-domain/appel-offre';

export const getDésignationCatégorie = ({
  nouvellePuissance,
  note,
  période,
}: {
  nouvellePuissance: number;
  note: number;
  période: AppelOffre.Periode;
}) => {
  if (période.noteThresholdBy !== 'category') {
    return;
  }

  return nouvellePuissance <= période.noteThreshold.volumeReserve.puissanceMax &&
    note >= période.noteThreshold.volumeReserve.noteThreshold
    ? 'volume-réservé'
    : 'hors-volume-réservé';
};
