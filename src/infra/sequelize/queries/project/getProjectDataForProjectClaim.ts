import { err, ok, wrapInfra } from '../../../../core/utils'
import { GetProjectDataForProjectClaim } from '@modules/project'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'

const { Project } = models
export const getProjectDataForProjectClaim: GetProjectDataForProjectClaim = (projectId) => {
  return wrapInfra(Project.findByPk(projectId)).andThen((projectRaw: any) => {
    if (!projectRaw) return err(new EntityNotFoundError())

    const { id, prixReference, nomProjet, numeroCRE, email } = projectRaw.get()

    const result: any = { id, prixReference, nomProjet, numeroCRE, email }

    return ok(result)
  })
}
