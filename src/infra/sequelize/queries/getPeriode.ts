import { UniqueEntityID } from '../../../core/domain'
import { err, errAsync, ok, wrapInfra } from '../../../core/utils'
import { GetPeriode } from '../../../modules/appelOffre'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetPeriode = (models): GetPeriode => (appelOffreId, periodeId) => {
  const { Periode } = models

  return wrapInfra(Periode.findOne({ where: { appelOffreId, periodeId } })).andThen(
    (periodeRaw: any) => {
      if (!periodeRaw) return err(new EntityNotFoundError())

      const { data } = periodeRaw.get()
      return ok({
        appelOffreId,
        periodeId,
        ...data,
      })
    }
  )
}
