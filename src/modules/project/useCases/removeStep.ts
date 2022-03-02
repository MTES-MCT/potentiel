import { DomainEvent, EventBus } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectDCRRemoved, ProjectPTFRemoved } from '../events'

interface RemoveStepDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  eventBus: EventBus
}

type RemoveStepArgs = {
  type: 'ptf' | 'dcr'
  projectId: string
  removedBy: User
}

export const makeRemoveStep =
  (deps: RemoveStepDeps) =>
  (args: RemoveStepArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projectId, removedBy, type } = args

    return wrapInfra(deps.shouldUserAccessProject({ projectId, user: removedBy })).andThen(
      (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError())
        return deps.eventBus.publish(EventByType[type](args))
      }
    )
  }

const EventByType: Record<RemoveStepArgs['type'], (args: RemoveStepArgs) => DomainEvent> = {
  dcr: ({ projectId, removedBy }) =>
    new ProjectDCRRemoved({
      payload: {
        projectId,
        removedBy: removedBy.id,
      },
    }),
  ptf: ({ projectId, removedBy }) =>
    new ProjectPTFRemoved({
      payload: {
        projectId,
        removedBy: removedBy.id,
      },
    }),
}
