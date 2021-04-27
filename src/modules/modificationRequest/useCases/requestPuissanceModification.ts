import { Repository, TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { errAsync, logger, okAsync, ResultAsync, wrapInfra } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { FileContents, FileObject, IllegalFileDataError, makeAndSaveFile } from '../../file'
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
  fileRepo: Repository<FileObject>
}

interface RequestPuissanceModificationArgs {
  projectId: UniqueEntityID
  requestedBy: User
  newPuissance: number
  justification?: string
  file?: { contents: FileContents; filename: string }
}

const MIN_AUTO_ACCEPT_PUISSANCE_RATIO = 0.9
const MAX_AUTO_ACCEPT_PUISSANCE_RATIO = 1.1

export const makeRequestPuissanceModification = (deps: RequestPuissanceModificationDeps) => (
  args: RequestPuissanceModificationArgs
): ResultAsync<
  null,
  | AggregateHasBeenUpdatedSinceError
  | InfraNotAvailableError
  | EntityNotFoundError
  | UnauthorizedError
> => {
  const { projectId, requestedBy, newPuissance, justification, file } = args
  const { eventBus, shouldUserAccessProject, projectRepo, fileRepo } = deps

  return wrapInfra(shouldUserAccessProject({ projectId: projectId.toString(), user: requestedBy }))
    .andThen(
      (
        userHasRightsToProject
      ): ResultAsync<
        any,
        AggregateHasBeenUpdatedSinceError | InfraNotAvailableError | UnauthorizedError
      > => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError())
        if (!file) return okAsync(null)

        return makeAndSaveFile({
          file: {
            designation: 'puissance',
            forProject: projectId,
            createdBy: new UniqueEntityID(requestedBy.id),
            filename: file.filename,
            contents: file.contents,
          },
          fileRepo,
        })
          .map((responseFileId) => responseFileId)
          .mapErr((e: Error) => {
            logger.error(e)
            return new InfraNotAvailableError()
          })
      }
    )
    .andThen(
      (
        fileId: string
      ): ResultAsync<
        { newPuissanceIsAutoAccepted: boolean; fileId: string },
        InfraNotAvailableError | UnauthorizedError
      > => {
        return projectRepo.transaction(
          projectId,
          (
            project: Project
          ): ResultAsync<
            { newPuissanceIsAutoAccepted: boolean; fileId: string },
            AggregateHasBeenUpdatedSinceError | ProjectCannotBeUpdatedIfUnnotifiedError
          > => {
            const puissanceModificationRatio = newPuissance / project.puissanceInitiale

            const newPuissanceIsAutoAccepted =
              puissanceModificationRatio >= MIN_AUTO_ACCEPT_PUISSANCE_RATIO &&
              puissanceModificationRatio <= MAX_AUTO_ACCEPT_PUISSANCE_RATIO

            if (newPuissanceIsAutoAccepted) {
              return project.updatePuissance(requestedBy, newPuissance).asyncMap(async () => {
                return {
                  newPuissanceIsAutoAccepted,
                  fileId,
                }
              })
            }

            return okAsync({ newPuissanceIsAutoAccepted: false, fileId })
          }
        )
      }
    )
    .andThen(
      (args: {
        newPuissanceIsAutoAccepted: boolean
        fileId: string
      }): ResultAsync<null, AggregateHasBeenUpdatedSinceError | InfraNotAvailableError> => {
        const { newPuissanceIsAutoAccepted, fileId } = args

        const payload = {
          modificationRequestId: new UniqueEntityID().toString(),
          projectId: projectId.toString(),
          requestedBy: requestedBy.id,
          type: 'puissance',
          puissance: newPuissance,
          justification,
          fileId,
        }

        return eventBus.publish(
          newPuissanceIsAutoAccepted
            ? new ModificationReceived({ payload })
            : new ModificationRequested({ payload })
        )
      }
    )
}
