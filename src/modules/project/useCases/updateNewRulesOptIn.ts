import { EventBus } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectNewRulesOptedIn } from '../events'

interface updateNewRulesOptIn {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  eventBus: EventBus
}

type updateNewRulesOptInArgs = {
  projectId: string
  optedInBy: User
}

export const makeUpdateNewRulesOptIn =
  (deps: updateNewRulesOptIn) =>
  ({
    projectId,
    optedInBy,
  }: updateNewRulesOptInArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    return wrapInfra(deps.shouldUserAccessProject({ projectId, user: optedInBy })).andThen(
      (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError())

        return deps.eventBus.publish(
          new ProjectNewRulesOptedIn({
            payload: { projectId, optedInBy: optedInBy.id },
          })
        )
      }
    )
  }
