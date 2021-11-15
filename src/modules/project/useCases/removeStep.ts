import { DomainEvent, EventBus } from '../../../core/domain'
import { errAsync, ResultAsync, wrapInfra } from '../../../core/utils'
import { User } from '../../../entities'
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
  const { projectId, removedBy } = args

  return wrapInfra(deps.shouldUserAccessProject({ projectId, user: removedBy })).andThen(
    (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
      if (!userHasRightsToProject) return errAsync(new UnauthorizedError())

      return deps.eventBus.publish(_makeEventForType(args))
    }
  )
}

const _makeEventForType = ({ type, projectId, removedBy }: RemoveStepArgs): DomainEvent => {
  const payload = {
    projectId,
    removedBy: removedBy.id,
  }

  switch (type) {
    case 'dcr':
      return new ProjectDCRRemoved({ payload })
    case 'ptf':
      return new ProjectPTFRemoved({ payload })
    case 'garantie-financiere':
      return new ProjectGFRemoved({ payload })
  }
}
