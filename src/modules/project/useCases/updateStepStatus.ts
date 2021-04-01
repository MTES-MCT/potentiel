import { errAsync, ResultAsync, wrapInfra } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectStepStatusUpdated } from '../events'

interface UpdateStepStatusDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  eventBus: EventBus
}

type UpdateStepStatusArgs = {
  projectId: string
  projectStepId: string
  updatedBy: User
  newStatus: 'à traiter' | 'validé'
}

export const makeUpdateStepStatus = (deps: UpdateStepStatusDeps) => (
  args: UpdateStepStatusArgs
): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
  const { projectId, updatedBy, newStatus, projectStepId } = args

  return wrapInfra(deps.shouldUserAccessProject({ projectId, user: updatedBy })).andThen(
    (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
      if (!userHasRightsToProject) return errAsync(new UnauthorizedError())

      return deps.eventBus.publish(
        new ProjectStepStatusUpdated({
          payload: { projectStepId, updatedBy: updatedBy.id, newStatus },
        })
      )
    }
  )
}
