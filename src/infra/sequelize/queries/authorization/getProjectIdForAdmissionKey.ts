import { err, errAsync, ok, wrapInfra } from '../../../../core/utils'
import { GetProjectIdForAdmissionKey } from '../../../../modules/authorization/queries'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../../modules/shared'
import models from '../../models'

const { ProjectAdmissionKey } = models
export const getProjectIdForAdmissionKey: GetProjectIdForAdmissionKey = (
  projectAdmissionKeyId: string
) => {
  return wrapInfra(
    ProjectAdmissionKey.findByPk(projectAdmissionKeyId, {
      attributes: ['projectId'],
    })
  ).andThen((projectAdmissionKey: any) => {
    if (!projectAdmissionKey) return err(new EntityNotFoundError())

    return ok(projectAdmissionKey.projectId)
  })
}
