import { ok, wrapInfra } from '../../../core/utils'
import { GetPeriodeList } from '../../../modules/appelOffre'

export const makeGetPeriodeList = (models): GetPeriodeList => () => {
  const { Periode } = models

  return wrapInfra(Periode.findAll()).andThen((PeriodeListRaw: any) => {
    return ok(
      PeriodeListRaw.map((appelOffreRaw) => appelOffreRaw.get()).map(
        ({ appelOffreId, periodeId, data }) => ({
          appelOffreId,
          periodeId,
          ...data,
        })
      )
    )
  })
}
