import { ProjectAppelOffre, Technologie } from '@entities'
import { getAutoAcceptRatios } from './getAutoAcceptRatios'

export type IsOutsideAutoAcceptRatios = (arg: {
  project: {
    puissanceInitiale: number
    appelOffre?: ProjectAppelOffre
    technologie: Technologie
  }
  nouvellePuissance: number
}) => boolean

export const isOutsideAutoAcceptRatios: IsOutsideAutoAcceptRatios = ({
  project,
  nouvellePuissance,
}) => {
  const { puissanceInitiale } = project
  const { min, max } = getAutoAcceptRatios(project)
  const ratio = nouvellePuissance / puissanceInitiale
  return !(ratio >= min && ratio <= max)
}
