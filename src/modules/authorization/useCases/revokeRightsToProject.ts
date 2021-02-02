import { errAsync } from 'neverthrow'
import { logger, ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { UserRightsToProjectRevoked } from '../events'

interface RevokeRightsToProjectDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  eventBus: EventBus
}

interface RevokeRightsToProjectArgs {
  projectId: string
  userId: string
  revokedBy: User
}

export const makeRevokeRightsToProject = (deps: RevokeRightsToProjectDeps) => ({
  projectId,
  userId,
  revokedBy,
}: RevokeRightsToProjectArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
  return ResultAsync.fromPromise(
    deps.shouldUserAccessProject({ projectId, user: revokedBy }),
    (e: Error) => {
      logger.error(e)
      return new InfraNotAvailableError()
    }
  ).andThen((userHasRightsToProject) =>
    userHasRightsToProject
      ? deps.eventBus.publish(
          new UserRightsToProjectRevoked({
            payload: {
              projectId,
              userId,
              revokedBy: revokedBy.id,
            },
          })
        )
      : errAsync(new UnauthorizedError())
  )
}
