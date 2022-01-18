import { TransactionalRepository, UniqueEntityID } from '@core/domain'
import { err, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ModificationRequest } from '../ModificationRequest'

interface CancelModificationRequestDeps {
  modificationRequestRepo: TransactionalRepository<ModificationRequest>
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
}

interface CancelModificationRequestArgs {
  modificationRequestId: UniqueEntityID
  cancelledBy: User
}

export const makeCancelModificationRequest = (deps: CancelModificationRequestDeps) => (
  args: CancelModificationRequestArgs
): ResultAsync<null, InfraNotAvailableError | EntityNotFoundError | UnauthorizedError> => {
  const { modificationRequestRepo, shouldUserAccessProject } = deps
  const { modificationRequestId, cancelledBy } = args

  return modificationRequestRepo.transaction(modificationRequestId, (modificationRequest) => {
    return wrapInfra(
      shouldUserAccessProject({
        user: cancelledBy,
        projectId: modificationRequest.projectId.toString(),
      })
    ).andThen((isUserAuthorized) => {
      if (!isUserAuthorized) return err(new UnauthorizedError())
      return modificationRequest.cancel(cancelledBy)
    })
  })
}
