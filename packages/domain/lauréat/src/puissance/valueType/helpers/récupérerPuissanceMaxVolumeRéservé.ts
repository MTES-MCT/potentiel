import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

type RécupérerPuissanceMaxVolumeRéservéProps = {
  période: PlainType<AppelOffre.Periode>;
};

export const récupérerPuissanceMaxVolumeRéservé = ({
  période,
}: RécupérerPuissanceMaxVolumeRéservéProps) => {
  if (période.noteThresholdBy === 'category') {
    const {
      noteThreshold: { volumeReserve },
    } = période;

    return volumeReserve.puissanceMax;
  }

  return undefined;
};
