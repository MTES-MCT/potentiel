import { ProjectAppelOffre } from '@entities'

export const getReservedVolume = (
  appelOffre: ProjectAppelOffre
): { puissanceMax: number } | undefined => {
  const { periode } = appelOffre

  if (periode.isNotifiedOnPotentiel) {
    if (periode.noteThresholdBy === 'category') {
      const {
        noteThreshold: { volumeReserve },
      } = periode

      return volumeReserve
    }
  }
}
