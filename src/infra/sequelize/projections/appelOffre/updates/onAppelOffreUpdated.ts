import { logger } from '../../../../../core/utils'
import { AppelOffreUpdated } from '@modules/appelOffre'
import { appelOffreProjector } from '../appelOffre.model'

export const onAppelOffreUpdated = appelOffreProjector.on(AppelOffreUpdated).update({
  where: ({ payload: { appelOffreId } }) => ({ id: appelOffreId }),
  delta: ({ payload: { delta } }) => ({ data: delta }),
})
