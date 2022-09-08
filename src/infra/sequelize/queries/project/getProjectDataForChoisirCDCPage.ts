import { err, ok, wrapInfra } from '@core/utils'
import { getProjectAppelOffre } from '@config/queries.config'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'
import { GetProjectDataForChoisirCDCPage } from '@modules/project'

const { Project } = models
export const getProjectDataForChoisirCDCPage: GetProjectDataForChoisirCDCPage = ({ projectId }) => {
  return wrapInfra(Project.findByPk(projectId)).andThen((projectRaw: any) => {
    if (!projectRaw) return err(new EntityNotFoundError())

    const { id, appelOffreId, periodeId, familleId, classe, newRulesOptIn } = projectRaw.get()

    const result = {
      id,
      appelOffreId,
      periodeId,
      familleId,
      appelOffre: getProjectAppelOffre({ appelOffreId, periodeId, familleId }),
      newRulesOptIn,
      isClasse: classe === 'Classé',
    }
    return ok(result)
  })
}
