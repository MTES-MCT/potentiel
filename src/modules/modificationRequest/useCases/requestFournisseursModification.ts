import { Repository, TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { errAsync, logger, okAsync, ResultAsync, wrapInfra } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { FileContents, FileObject, makeAndSaveFile } from '../../file'
import { Fournisseur, ProjectCannotBeUpdatedIfUnnotifiedError } from '../../project'
import { Project } from '../../project/Project'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../shared'
import { ModificationReceived } from '../events'

interface RequestFournisseurModificationDeps {
  eventBus: EventBus
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: TransactionalRepository<Project>
  fileRepo: Repository<FileObject>
}

interface RequestFournisseurModificationArgs {
  projectId: UniqueEntityID
  requestedBy: User
  newFournisseurs: Fournisseur[]
  newEvaluationCarbone?: number
  justification?: string
  file?: { contents: FileContents; filename: string }
}

export const makeRequestFournisseursModification = (deps: RequestFournisseurModificationDeps) => (
  args: RequestFournisseurModificationArgs
): ResultAsync<
  null,
  | AggregateHasBeenUpdatedSinceError
  | InfraNotAvailableError
  | EntityNotFoundError
  | UnauthorizedError
> => {
  const {
    projectId,
    requestedBy,
    newFournisseurs,
    newEvaluationCarbone,
    justification,
    file,
  } = args
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
            designation: 'modification-request',
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
      (fileId: string): ResultAsync<string, InfraNotAvailableError | UnauthorizedError> => {
        return projectRepo.transaction(
          projectId,
          (
            project: Project
          ): ResultAsync<
            string,
            AggregateHasBeenUpdatedSinceError | ProjectCannotBeUpdatedIfUnnotifiedError
          > => {
            return project
              .updateFournisseurs(requestedBy, newFournisseurs, newEvaluationCarbone)
              .asyncMap(async () => fileId)
          }
        )
      }
    )
    .andThen(
      (
        fileId: string
      ): ResultAsync<null, AggregateHasBeenUpdatedSinceError | InfraNotAvailableError> => {
        return eventBus.publish(
          new ModificationReceived({
            payload: {
              modificationRequestId: new UniqueEntityID().toString(),
              projectId: projectId.toString(),
              requestedBy: requestedBy.id,
              type: 'fournisseur',
              fournisseurs: newFournisseurs,
              evaluationCarbone: newEvaluationCarbone,
              justification,
              fileId,
            },
          })
        )
      }
    )
}
