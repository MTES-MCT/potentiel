import { err, ok, ResultAsync, wrapInfra } from '../../../core/utils'
import { GetCahierChargesURL } from '../../../modules/appelOffre'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetCahierChargesURL = (models): GetCahierChargesURL => (
  appelOffreId,
  periodeId
) => {
  const { Periode } = models

  return wrapInfra(Periode.findOne({ where: { appelOffreId, periodeId } })).andThen(
    (periodeRaw: any) => {
      if (!periodeRaw) return ok(undefined)

      const { data } = periodeRaw.get()

      const cahierChargesURL: string = data?.['Lien du cahier des charges']

      return ok(cahierChargesURL)
    }
  )
}
