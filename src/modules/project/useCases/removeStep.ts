import { errAsync, logger, okAsync, ResultAsync, wrapInfra } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus, StoredEvent } from '../../eventStore'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectDCRRemoved, ProjectGFRemoved, ProjectPTFRemoved } from '../events'

interface RemoveStepDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  eventBus: EventBus
}

type RemoveStepArgs = {
  type: 'ptf' | 'dcr' | 'garantie-financiere'
  projectId: string
  removedBy: User
}

export const makeRemoveStep = (deps: RemoveStepDeps) => (
  args: RemoveStepArgs
): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
  const { type, projectId, removedBy } = args

  return wrapInfra(deps.shouldUserAccessProject({ projectId, user: removedBy })).andThen(
    (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
      if (!userHasRightsToProject) return errAsync(new UnauthorizedError())

      return deps.eventBus.publish(EventByType[type](args))
    }
  )
}

const EventByType: Record<RemoveStepArgs['type'], (args: RemoveStepArgs) => StoredEvent> = {
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
  'garantie-financiere': ({ projectId, removedBy }) =>
    new ProjectGFRemoved({
      payload: {
        projectId,
        removedBy: removedBy.id,
      },
    }),
}
