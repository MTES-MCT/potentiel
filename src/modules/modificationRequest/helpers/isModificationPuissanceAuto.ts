import { ProjectAppelOffre } from '@entities'

export const defaultAutoAcceptRatios = { min: 0.9, max: 1.1 }

export type IsModificationPuissanceAuto = (arg: {
  project: {
    puissanceInitiale: number
    appelOffre?: ProjectAppelOffre
  }
  nouvellePuissance: number
}) => boolean

export const isModificationPuissanceAuto: IsModificationPuissanceAuto = ({
  project,
  nouvellePuissance,
}) => {
  const { appelOffre, puissanceInitiale } = project
  const volumeReserve = appelOffre && getReservedVolume(appelOffre)

  if (volumeReserve) {
    const { puissanceMax } = volumeReserve
    const wasNotifiedOnReservedVolume = puissanceInitiale <= puissanceMax
    if (wasNotifiedOnReservedVolume && nouvellePuissance > puissanceMax) {
      return false
    }
  }

  const { min, max } = appelOffre
    ? appelOffre.changementPuissance.autoAcceptRatios
    : defaultAutoAcceptRatios
  const ratio = nouvellePuissance / puissanceInitiale

  return ratio >= min && ratio <= max
}

const getReservedVolume = (appelOffre: ProjectAppelOffre): { puissanceMax: number } | undefined => {
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
