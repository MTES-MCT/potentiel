import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

export const récupérerVolumeRéservé = ({
  période,
}: {
  période: PlainType<AppelOffre.Periode>;
}):
  | {
      noteThreshold: number;
      puissanceMax: number;
    }
  | undefined => {
  if (période.noteThresholdBy === 'category') {
    const {
      noteThreshold: { volumeReserve },
    } = période;

    return volumeReserve;
  }
};
