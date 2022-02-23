import { DomainEvent, EventBus, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import {
  GFCertificateHasAlreadyBeenSentError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
} from '../errors'
import { ProjectDCRRemoved, ProjectPTFRemoved } from '../events'
import { Project } from '../Project'

interface RemoveStepDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  eventBus: EventBus
  projectRepo: TransactionalRepository<Project>
}

type RemoveStepArgs = {
  type: 'ptf' | 'dcr' | 'garantie-financiere'
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
        if (type === 'garantie-financiere') {
          return deps.projectRepo.transaction(
            new UniqueEntityID(projectId),
            (
              project: Project
            ): ResultAsync<
              null,
              ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError
            > => {
              return project.deleteGarantiesFinancieres(removedBy).asyncMap(async () => null)
            }
          )
        }
        return deps.eventBus.publish(EventByType[type](args))
      }
    )
  }

const EventByType: Record<
  Exclude<RemoveStepArgs['type'], 'garantie-financiere'>,
  (args: RemoveStepArgs) => DomainEvent
> = {
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
