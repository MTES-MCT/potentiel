import { ok, wrapInfra } from '../../../core/utils'
import { GetAppelOffreList } from '../../../modules/appelOffre'

export const makeGetAppelOffreList = (models): GetAppelOffreList => () => {
  const { AppelOffre } = models

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
