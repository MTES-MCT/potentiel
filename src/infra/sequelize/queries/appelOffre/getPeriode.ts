import { err, ok, wrapInfra } from '../../../../core/utils'
import { GetPeriode } from '../../../../modules/appelOffre'
import { EntityNotFoundError } from '../../../../modules/shared'
import models from '../../models'

const { Periode } = models
export const getPeriode: GetPeriode = (appelOffreId, periodeId) => {
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
