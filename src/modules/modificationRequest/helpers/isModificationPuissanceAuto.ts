import { ProjectAppelOffre, Technologie } from '@entities'

export const defaultAutoAcceptRatios = { min: 0.9, max: 1.1 }

export type IsModificationPuissanceAuto = (arg: {
  project: {
    puissanceInitiale: number
    appelOffre?: ProjectAppelOffre
    technologie: Technologie
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

  const { min, max } = getAutoAccepRatios(project)
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

export const getAutoAccepRatios = (project: {
  appelOffre?: ProjectAppelOffre
  technologie: Technologie
}): { min: number; max: number } => {
  const { appelOffre, technologie } = project

  if (!appelOffre) {
    return defaultAutoAcceptRatios
  }

  if (appelOffre.changementPuissance.changementByTechnologie) {
    if (technologie === 'N/A') {
      return defaultAutoAcceptRatios
    }

    return appelOffre.changementPuissance.autoAcceptRatios[technologie]
  }

  return appelOffre.changementPuissance.autoAcceptRatios
}
