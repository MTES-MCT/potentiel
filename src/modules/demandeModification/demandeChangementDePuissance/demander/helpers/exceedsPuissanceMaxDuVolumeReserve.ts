import { ProjectAppelOffre } from '@entities'
import { getVolumeReserve } from './getVolumeReserve'

export type ExceedsPuissanceMaxDuVolumeReserve = (arg: {
  project: {
    puissanceInitiale: number
    appelOffre?: ProjectAppelOffre
  }
  nouvellePuissance: number
}) => boolean

export const exceedsPuissanceMaxDuVolumeReserve: ExceedsPuissanceMaxDuVolumeReserve = ({
  project,
  nouvellePuissance,
}) => {
  const { appelOffre, puissanceInitiale } = project
  const volumeReserve = appelOffre && getVolumeReserve(appelOffre)

  if (volumeReserve) {
    const { puissanceMax } = volumeReserve
    const wasNotifiedOnVolumeReserve = puissanceInitiale <= puissanceMax
    if (wasNotifiedOnVolumeReserve && nouvellePuissance > puissanceMax) {
      return true
    }
  }

  return false
}
