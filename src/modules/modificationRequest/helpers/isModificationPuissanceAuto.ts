import { ProjectAppelOffre, Technologie } from '@entities'

export const defaultAutoAcceptRatios = { min: 0.9, max: 1.1 }

export type IsModificationPuissanceAuto = (arg: {
  project: {
    puissanceInitiale: number
    appelOffre?: ProjectAppelOffre
    technologie: Technologie
  }
  nouvellePuissance: number
}) =>
  | { isAuto: true }
  | {
      isAuto: false
      reason: 'puissance-max-volume-reseve-depassée'
      puissanceMax: number
    }
  | {
      isAuto: false
      reason: 'hors-ratios-autorisés'
      ratios: typeof defaultAutoAcceptRatios
    }

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
      return {
        isAuto: false,
        reason: 'puissance-max-volume-reseve-depassée',
        puissanceMax,
      }
    }
  }

  const { min, max } = getAutoAcceptRatios(project)
  const ratio = nouvellePuissance / puissanceInitiale
  const modificationHorsRatios = !(ratio >= min && ratio <= max)

  return modificationHorsRatios
    ? {
        isAuto: false,
        reason: 'hors-ratios-autorisés',
        ratios: { min, max },
      }
    : {
        isAuto: true,
      }
}

const getReservedVolume = (appelOffre: ProjectAppelOffre): { puissanceMax: number } | undefined => {
  const { periode } = appelOffre

  if (periode.noteThresholdBy === 'category') {
    const {
      noteThreshold: { volumeReserve },
    } = periode

    return volumeReserve
  }
}

const getAutoAcceptRatios = (project: {
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
