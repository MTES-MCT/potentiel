import { AppelOffreCreated } from '@modules/appelOffre'
import { appelOffreProjector } from '../appelOffre.model'

export const onAppelOffreCreated = appelOffreProjector
  .on(AppelOffreCreated)
  .create(({ payload: { appelOffreId, data } }) => ({
    id: appelOffreId,
    data,
  }))
