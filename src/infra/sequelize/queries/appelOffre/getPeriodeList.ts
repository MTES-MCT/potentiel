import { ok, wrapInfra } from '../../../../core/utils'
import { GetPeriodeList } from '../../../../modules/appelOffre'
import models from '../../models'

const { Periode } = models
export const getPeriodeList: GetPeriodeList = () => {
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
