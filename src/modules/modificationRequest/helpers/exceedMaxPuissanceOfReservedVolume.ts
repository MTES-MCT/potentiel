import { ProjectAppelOffre } from '@entities'
import { getReservedVolume } from './getReservedVolume'

export type ExceedMaxPuissanceOfReservedVolume = (arg: {
  project: {
    puissanceInitiale: number
    appelOffre?: ProjectAppelOffre
  }
  nouvellePuissance: number
}) => boolean

export const exceedMaxPuissanceOfReservedVolume: ExceedMaxPuissanceOfReservedVolume = ({
  project,
  nouvellePuissance,
}) => {
  const { appelOffre, puissanceInitiale } = project
  const volumeReserve = appelOffre && getReservedVolume(appelOffre)

  if (volumeReserve) {
    const { puissanceMax } = volumeReserve
    const wasNotifiedOnReservedVolume = puissanceInitiale <= puissanceMax
    if (wasNotifiedOnReservedVolume && nouvellePuissance > puissanceMax) {
      return true
    }
  }

  return false
}
