import { AppelOffre } from '@potentiel-domain/appel-offre';

export const getVolumeReserve = (
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel,
  périodeId: string,
): { noteThreshold: number; puissanceMax: number } | undefined => {
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
