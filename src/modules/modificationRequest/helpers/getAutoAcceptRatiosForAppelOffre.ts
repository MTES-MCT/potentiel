import { AppelOffre } from '@entities'

export type GetAutoAcceptRatiosForAppelOffre = (appelOffre: AppelOffre | undefined) => {
  min: number
  max: number
}

const defaultRatios = { min: 0.9, max: 1.1 }

export const getAutoAcceptRatiosForAppelOffre: GetAutoAcceptRatiosForAppelOffre = (appelOffre) => {
  if (!appelOffre) {
    return defaultRatios
  }

  const { type } = appelOffre

  switch (type) {
    case 'autoconso':
      return { min: 0.8, max: 1 }
    case 'innovation':
      return { min: 0.7, max: 1 }
    default:
      return defaultRatios
  }
}
