import { AppelOffre } from '@potentiel-domain/appel-offre';

type GetVolumeReserve = {
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
  périodeId: string;
};
export const getVolumeReserve = ({
  appelOffre,
  périodeId,
}: GetVolumeReserve): { noteThreshold: number; puissanceMax: number } | undefined => {
  const période = appelOffre.periodes.find((p) => p.id === périodeId);

  if (période?.type === 'notified') {
    if (période.noteThresholdBy === 'category') {
      const {
        noteThreshold: { volumeReserve },
      } = période;

      return volumeReserve;
    }
  }
};
