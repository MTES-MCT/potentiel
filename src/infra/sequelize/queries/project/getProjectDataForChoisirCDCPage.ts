import { err, ok, wrapInfra } from '@core/utils'
import { getProjectAppelOffre } from '@config/queries.config'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'
import { GetProjectDataForChoisirCDCPage, ProjectDataForChoisirCDCPage } from '@modules/project'

const { Project } = models

export const getProjectDataForChoisirCDCPage: GetProjectDataForChoisirCDCPage = (projectId) => {
  return wrapInfra(Project.findByPk(projectId)).andThen((projectRaw: any) => {
    if (!projectRaw) return err(new EntityNotFoundError())

    const { id, appelOffreId, periodeId, familleId, cahierDesChargesActuel } = projectRaw.get()

    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })
    if (!appelOffre) return err(new EntityNotFoundError())

    const pageProps: ProjectDataForChoisirCDCPage = {
      id,
      appelOffre,
      cahierDesChargesActuel,
    }

    return ok(pageProps)
  })
}
