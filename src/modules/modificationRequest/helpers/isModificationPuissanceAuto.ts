import { AppelOffre } from '@entities'

export type IsModificationPuissanceAuto = (arg: {
  project: {
    puissanceInitiale: number
    appelOffre?: AppelOffre
  }
  nouvellePuissance: number
}) => boolean

const defaultRatios = { min: 0.9, max: 1.1 }

export const isModificationPuissanceAuto: IsModificationPuissanceAuto = ({
  project: { appelOffre, puissanceInitiale },
  nouvellePuissance,
}) => {
  const { min, max } = getAutoAcceptRatios(appelOffre)
  const ratio = nouvellePuissance / puissanceInitiale

  return ratio >= min && ratio <= max
}

export const getAutoAcceptRatios = (
  appelOffre: AppelOffre | undefined
): { min: number; max: number } => {
  if (!appelOffre) {
    return defaultRatios
  }

  switch (appelOffre.type) {
    case 'autoconso':
      return { min: 0.8, max: 1 }
    case 'innovation':
      return { min: 0.7, max: 1 }
    default:
      return defaultRatios
  }
}
