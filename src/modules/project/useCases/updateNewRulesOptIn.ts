import { EventBus, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectNewRulesOptedIn } from '../events'
import { Project } from '../Project'
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit'

interface UpdateNewRulesOptIn {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  eventBus: EventBus
  projectRepo: Repository<Project>
}

type UpdateNewRulesOptInArgs = {
  projectId: string
  optedInBy: User
}

export const makeUpdateNewRulesOptIn =
  ({ shouldUserAccessProject, eventBus, projectRepo }: UpdateNewRulesOptIn) =>
  ({ projectId, optedInBy }: UpdateNewRulesOptInArgs) => {
    return wrapInfra(shouldUserAccessProject({ projectId, user: optedInBy }))
      .andThen((userHasRightsToProject) =>
        projectRepo.load(new UniqueEntityID(projectId)).andThen((project) => {
          if (project.newRulesOptIn) return errAsync(new NouveauCahierDesChargesDéjàSouscrit())
          return okAsync(userHasRightsToProject)
        })
      )
      .andThen(
        (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
          if (!userHasRightsToProject) return errAsync(new UnauthorizedError())
          return eventBus.publish(
            new ProjectNewRulesOptedIn({
              payload: { projectId, optedInBy: optedInBy.id },
            })
          )
        }
      )
  }
