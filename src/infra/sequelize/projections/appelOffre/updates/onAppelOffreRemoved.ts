import { logger } from '../../../../../core/utils'
import { AppelOffreRemoved } from '../../../../../modules/appelOffre'
import { appelOffreProjector } from '../appelOffre.model'
import { periodeProjector } from '../periode.model'

export const onAppelOffreRemoved = appelOffreProjector
  .on(AppelOffreRemoved)
  .delete(({ payload: { appelOffreId } }) => ({ id: appelOffreId }))

export const onAppelOffreRemovedRemovePeriodes = periodeProjector
  .on(AppelOffreRemoved)
  .delete(({ payload: { appelOffreId } }) => ({ appelOffreId }))
