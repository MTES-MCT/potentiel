import { err, errAsync, ok, wrapInfra } from '../../../core/utils'
import { GetProjectIdForAdmissionKey } from '../../../modules/authorization/queries'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetProjectIdForAdmissionKey = (models): GetProjectIdForAdmissionKey => (
  projectAdmissionKeyId: string
) => {
  const { ProjectAdmissionKey } = models
  if (!ProjectAdmissionKey) return errAsync(new InfraNotAvailableError())

  return wrapInfra(
    ProjectAdmissionKey.findByPk(projectAdmissionKeyId, {
      attributes: ['projectId'],
    })
  ).andThen((projectAdmissionKey: any) => {
    if (!projectAdmissionKey) return err(new EntityNotFoundError())

    return ok(projectAdmissionKey.projectId)
  })
}
