import { err, ok, wrapInfra } from '../../../../core/utils'
import { GetAppelOffre } from '@modules/appelOffre'
import { EntityNotFoundError } from '../../../../modules/shared'
import models from '../../models'

const { AppelOffre } = models

export const getAppelOffre: GetAppelOffre = (appelOffreId) => {
  return wrapInfra(AppelOffre.findByPk(appelOffreId)).andThen((appelOffreRaw: any) => {
    if (!appelOffreRaw) return err(new EntityNotFoundError())

    const { data } = appelOffreRaw.get()
    return ok({
      appelOffreId,
      ...data,
    })
  })
}
