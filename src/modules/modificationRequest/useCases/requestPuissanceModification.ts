import { TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { errAsync, okAsync, ResultAsync, wrapInfra } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from '../../project'
import { Project } from '../../project/Project'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../shared'
import { ModificationRequested, ModificationReceived } from '../events'

interface RequestPuissanceModificationDeps {
  eventBus: EventBus
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: TransactionalRepository<Project>
}

interface RequestPuissanceModificationArgs {
  projectId: UniqueEntityID
  requestedBy: User
  newPuissance: number
}

export const makeRequestPuissanceModification = (deps: RequestPuissanceModificationDeps) => (
  args: RequestPuissanceModificationArgs
): ResultAsync<
  null,
  | AggregateHasBeenUpdatedSinceError
  | InfraNotAvailableError
  | EntityNotFoundError
  | UnauthorizedError
> => {
  const { projectId, requestedBy, newPuissance } = args

  return wrapInfra(
    deps.shouldUserAccessProject({ projectId: projectId.toString(), user: requestedBy })
  )
    .andThen(
      (
        userHasRightsToProject
      ): ResultAsync<boolean, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError())

        return deps.projectRepo.transaction(
          projectId,
          (
            project: Project
          ): ResultAsync<
            boolean,
            AggregateHasBeenUpdatedSinceError | ProjectCannotBeUpdatedIfUnnotifiedError
          > => {
            const MIN_AUTO_ACCEPT_PUISSANCE_RATIO = 0.9
            const MAX_AUTO_ACCEPT_PUISSANCE_RATIO = 1.1
            const puissanceModificationRatio = newPuissance / project.puissanceInitiale

            const newPuissanceIsAutoAccepted =
              puissanceModificationRatio >= MIN_AUTO_ACCEPT_PUISSANCE_RATIO &&
              puissanceModificationRatio <= MAX_AUTO_ACCEPT_PUISSANCE_RATIO

            if (newPuissanceIsAutoAccepted) {
              return project
                .updatePuissance(requestedBy, newPuissance)
                .asyncMap(async () => newPuissanceIsAutoAccepted)
            }

            return okAsync(false)
          }
        )
      }
    )
    .andThen(
      (
        newPuissanceIsAutoAccepted
      ): ResultAsync<null, AggregateHasBeenUpdatedSinceError | InfraNotAvailableError> => {
        const payload = {
          modificationRequestId: new UniqueEntityID().toString(),
          projectId: projectId.toString(),
          requestedBy: requestedBy.id,
          type: 'puissance',
          puissance: newPuissance,
        }

        return deps.eventBus.publish(
          newPuissanceIsAutoAccepted
            ? new ModificationReceived({ payload })
            : new ModificationRequested({ payload })
        )
      }
    )
}
