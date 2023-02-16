import { err, ok, wrapInfra } from '@core/utils'
import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'
import { GetProjectDataForChoisirCDCPage, ProjectDataForChoisirCDCPage } from '@modules/project'
import { CahierDesChargesRéférence } from '@entities'

const { Project } = models

export const getProjectDataForChoisirCDCPage: GetProjectDataForChoisirCDCPage = (projectId) => {
  return wrapInfra(Project.findByPk(projectId)).andThen((projectRaw) => {
    if (!projectRaw) return err(new EntityNotFoundError())

    const { id, appelOffreId, periodeId, familleId, cahierDesChargesActuel, numeroGestionnaire } =
      projectRaw.get()

    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })
    if (!appelOffre) return err(new EntityNotFoundError())

    const pageProps: ProjectDataForChoisirCDCPage = {
      id,
      appelOffre,
      cahierDesChargesActuel: cahierDesChargesActuel as CahierDesChargesRéférence,
      identifiantGestionnaireRéseau: numeroGestionnaire,
    }

    return ok(pageProps)
  })
}
