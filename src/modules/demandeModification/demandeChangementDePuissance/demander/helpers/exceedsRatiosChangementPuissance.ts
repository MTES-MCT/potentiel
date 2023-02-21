import { ProjectAppelOffre, Technologie } from '@entities'
import { getRatiosChangementPuissance } from './getRatiosChangementPuissance'

export type ExceedsRatiosChangementPuissance = (arg: {
  project: {
    puissanceInitiale: number
    appelOffre?: ProjectAppelOffre
    technologie: Technologie
  }
  nouvellePuissance: number
}) => boolean

export const exceedsRatiosChangementPuissance: ExceedsRatiosChangementPuissance = ({
  project,
  nouvellePuissance,
}) => {
  const { puissanceInitiale } = project
  const { min, max } = getRatiosChangementPuissance(project)
  const ratio = nouvellePuissance / puissanceInitiale
  return !(ratio >= min && ratio <= max)
}
