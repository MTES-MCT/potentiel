import { ok, wrapInfra } from '../../../core/utils'
import { GetCahiersChargesURLs } from '../../../modules/appelOffre'

export const makeGetCahiersChargesURLs = (models): GetCahiersChargesURLs => (
  appelOffreId,
  periodeId
) => {
  const { Periode } = models

  return wrapInfra(Periode.findOne({ where: { appelOffreId, periodeId } })).andThen(
    (periodeRaw: any) => {
      if (!periodeRaw) return ok(undefined)

      const { data } = periodeRaw.get()

      const oldCahierChargesURL: string = data?.["Lien de l'ancien cahier des charges"]
      const newCahierChargesURL: string = data?.['Lien du nouveau cahier des charges']

      return ok({ oldCahierChargesURL, newCahierChargesURL })
    }
  )
}
