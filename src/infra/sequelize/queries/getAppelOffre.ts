import { UniqueEntityID } from '../../../core/domain'
import { err, errAsync, ok, wrapInfra } from '../../../core/utils'
import { GetAppelOffre } from '../../../modules/appelOffre'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetAppelOffre = (models): GetAppelOffre => (appelOffreId) => {
  const { AppelOffre } = models

  return wrapInfra(AppelOffre.findByPk(appelOffreId)).andThen((appelOffreRaw: any) => {
    if (!appelOffreRaw) return err(new EntityNotFoundError())

    const { data } = appelOffreRaw.get()
    return ok({
      appelOffreId,
      ...data,
    })
  })
}
