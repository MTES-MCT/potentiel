import { Repository, UniqueEntityID } from '@core/domain'
import { err, errAsync, ok, Result, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../shared'
import { StatusPreventsConfirmationError } from '../errors'
import { ModificationRequest } from '../ModificationRequest'

interface ConfirmRequestDeps {
  modificationRequestRepo: Repository<ModificationRequest>
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
}

interface ConfirmRequestArgs {
  modificationRequestId: UniqueEntityID
  versionDate: Date
  confirmedBy: User
}

export const makeConfirmRequest = (deps: ConfirmRequestDeps) => (
  args: ConfirmRequestArgs
): ResultAsync<
  null,
  | AggregateHasBeenUpdatedSinceError
  | InfraNotAvailableError
  | EntityNotFoundError
  | UnauthorizedError
> => {
  const { modificationRequestRepo } = deps
  const { modificationRequestId, versionDate, confirmedBy } = args

  if (confirmedBy.role !== 'porteur-projet') {
    return errAsync(new UnauthorizedError())
  }

  return modificationRequestRepo
    .load(modificationRequestId)
    .andThen(
      (
        modificationRequest
      ): ResultAsync<
        ModificationRequest,
        AggregateHasBeenUpdatedSinceError | InfraNotAvailableError
      > => {
        if (
          modificationRequest.lastUpdatedOn &&
          modificationRequest.lastUpdatedOn.getTime() !== versionDate.getTime()
        ) {
          return errAsync(new AggregateHasBeenUpdatedSinceError())
        }

        return wrapInfra(
          deps.shouldUserAccessProject({
            projectId: modificationRequest.projectId.toString(),
            user: confirmedBy,
          })
        ).andThen(
          (userHasRightsToProject): Result<ModificationRequest, UnauthorizedError> => {
            if (!userHasRightsToProject) {
              return err(new UnauthorizedError())
            }

            return ok(modificationRequest)
          }
        )
      }
    )
    .andThen(
      (
        modificationRequest
      ): Result<ModificationRequest, UnauthorizedError | StatusPreventsConfirmationError> => {
        return modificationRequest.confirm(confirmedBy).map(() => modificationRequest)
      }
    )
    .andThen((modificationRequest) => {
      return modificationRequestRepo.save(modificationRequest)
    })
}
