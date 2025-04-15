import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

type RécupérerVolumeRéservéProps = {
  période: PlainType<AppelOffre.Periode>;
};

export const récupérerVolumeRéservé = ({ période }: RécupérerVolumeRéservéProps) => {
  if (période.noteThresholdBy === 'category') {
    const {
      noteThreshold: { volumeReserve },
    } = période;

    return volumeReserve;
  }

  return undefined;
};
