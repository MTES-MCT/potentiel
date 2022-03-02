import { ProjectAppelOffre } from '@entities'
import { isNotifiedPeriode } from '@entities/periode'

export const getVolumeReserve = (
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
