import { err, errAsync, logger, ok, ResultAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetProjectIdForAdmissionKey = (models) => (projectAdmissionKeyId: string) => {
  const { ProjectAdmissionKey } = models
  if (!ProjectAdmissionKey) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    ProjectAdmissionKey.findByPk(projectAdmissionKeyId, {
      attributes: ['projectId'],
    }),
    (e: Error) => {
      logger.error(e)
      return new InfraNotAvailableError()
    }
  ).andThen((projectAdmissionKey: any) => {
    if (!projectAdmissionKey) return err(new EntityNotFoundError())

    return ok(projectAdmissionKey.projectId)
  })
}
