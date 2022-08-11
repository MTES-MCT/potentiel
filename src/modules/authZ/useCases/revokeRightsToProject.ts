import { errAsync } from 'neverthrow'
import { EventBus } from '@core/domain'
import { ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
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

export const makeRevokeRightsToProject =
  (deps: RevokeRightsToProjectDeps) =>
  ({
    projectId,
    userId,
    revokedBy,
  }: RevokeRightsToProjectArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    return wrapInfra(deps.shouldUserAccessProject({ projectId, user: revokedBy })).andThen(
      (userHasRightsToProject) =>
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
