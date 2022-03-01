import { isNotifiedPeriode, ProjectAppelOffre } from '@entities'

export const getReservedVolume = (
  appelOffre: ProjectAppelOffre
): { puissanceMax: number } | undefined => {
  const { periode } = appelOffre

  if (isNotifiedPeriode(periode)) {
    if (periode.noteThresholdBy === 'category') {
      const {
        noteThreshold: { volumeReserve },
      } = periode

      return volumeReserve
    }
  }
}
