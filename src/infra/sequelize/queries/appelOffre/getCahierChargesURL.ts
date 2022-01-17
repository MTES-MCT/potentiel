import { ok, wrapInfra } from '../../../../core/utils'
import { GetCahiersChargesURLs } from '@modules/appelOffre'
import models from '../../models'

const { Periode } = models

export const getCahiersChargesURLs: GetCahiersChargesURLs = (appelOffreId, periodeId) => {
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
