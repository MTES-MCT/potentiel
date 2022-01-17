import { ok, wrapInfra } from '../../../../core/utils'
import { GetAppelOffreList } from '@modules/appelOffre'
import models from '../../models'

const { AppelOffre } = models

export const getAppelOffreList: GetAppelOffreList = () => {
  return wrapInfra(AppelOffre.findAll()).andThen((appelOffreListRaw: any) => {
    return ok(
      appelOffreListRaw
        .map((appelOffreRaw) => appelOffreRaw.get())
        .map(({ id, data }) => ({
          appelOffreId: id,
          ...data,
        }))
    )
  })
}
