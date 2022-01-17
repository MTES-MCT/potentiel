import { Repository, UniqueEntityID } from '@core/domain'
import { err, errAsync, Result, ResultAsync } from '@core/utils'
import { User } from '../../../entities'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../shared'
import { ModificationRequest, ModificationRequestStatus } from '../ModificationRequest'

interface UpdateModificationRequestStatusDeps {
  modificationRequestRepo: Repository<ModificationRequest>
}

interface UpdateModificationRequestStatusArgs {
  modificationRequestId: UniqueEntityID
  versionDate: Date
  submittedBy: User
  newStatus: ModificationRequestStatus
}

export const makeUpdateModificationRequestStatus = (deps: UpdateModificationRequestStatusDeps) => (
  args: UpdateModificationRequestStatusArgs
): ResultAsync<
  null,
  | AggregateHasBeenUpdatedSinceError
  | InfraNotAvailableError
  | EntityNotFoundError
  | UnauthorizedError
> => {
  const { modificationRequestRepo } = deps
  const { modificationRequestId, versionDate, newStatus, submittedBy } = args

  if (!['admin', 'dgec'].includes(submittedBy.role)) {
    return errAsync(new UnauthorizedError())
  }

  return modificationRequestRepo
    .load(modificationRequestId)
    .andThen(
      (modificationRequest): Result<ModificationRequest, AggregateHasBeenUpdatedSinceError> => {
        if (
          modificationRequest.lastUpdatedOn &&
          modificationRequest.lastUpdatedOn.getTime() !== versionDate.getTime()
        ) {
          return err(new AggregateHasBeenUpdatedSinceError())
        }

        return modificationRequest
          .updateStatus({ updatedBy: submittedBy, newStatus })
          .map(() => modificationRequest)
      }
    )
    .andThen((modificationRequest) => {
      return modificationRequestRepo.save(modificationRequest)
    })
}
