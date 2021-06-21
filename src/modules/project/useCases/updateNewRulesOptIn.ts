import { Repository, UniqueEntityID } from '../../../core/domain'
import { errAsync, ok, ResultAsync, wrapInfra } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectNewRulesOptedIn } from '../events'
import { Project } from '../Project'

interface updateNewRulesOptIn {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: Repository<Project>
  eventBus: EventBus
}

type updateNewRulesOptInArgs = {
  projectId: string
  optedInBy: User
}

export const makeUpdateNewRulesOptIn = (deps: updateNewRulesOptIn) => (
  args: updateNewRulesOptInArgs
): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
  const { projectId, optedInBy } = args

  return wrapInfra(deps.shouldUserAccessProject({ projectId, user: optedInBy })).andThen(
    (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
      if (!userHasRightsToProject) return errAsync(new UnauthorizedError())

      return deps.projectRepo.load(new UniqueEntityID(projectId)).andThen((project) => {
        if (!project.newRulesOptIn) {
          return deps.eventBus.publish(
            new ProjectNewRulesOptedIn({
              payload: { projectId, optedInBy: optedInBy.id },
            })
          )
        }

        return ok(null)
      })
    }
  )
}
