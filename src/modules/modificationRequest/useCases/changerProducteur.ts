import { EventBus, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '../../file'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from '../../project'
import { Project } from '../../project/Project'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../shared'
import { ModificationReceived } from '../events'

type ChangerProducteurDeps = {
  eventBus: EventBus
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: TransactionalRepository<Project>
  fileRepo: Repository<FileObject>
}

type ChangerProducteurArgs = {
  projetId: string
  porteur: User
  nouveauProducteur: string
  justification?: string
  fichier?: { contents: FileContents; filename: string }
  email?: string
}

export const makeChangerProducteur =
  (deps: ChangerProducteurDeps) =>
  (
    args: ChangerProducteurArgs
  ): ResultAsync<
    null,
    | AggregateHasBeenUpdatedSinceError
    | InfraNotAvailableError
    | EntityNotFoundError
    | UnauthorizedError
  > => {
    const { projetId, porteur, nouveauProducteur, justification, fichier } = args
    const { eventBus, shouldUserAccessProject, projectRepo, fileRepo } = deps

    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: porteur }))
      .andThen(
        (
          userHasRightsToProject
        ): ResultAsync<
          any,
          AggregateHasBeenUpdatedSinceError | InfraNotAvailableError | UnauthorizedError
        > => {
          if (!userHasRightsToProject) return errAsync(new UnauthorizedError())
          if (!fichier) return okAsync(null)

          return makeAndSaveFile({
            file: {
              designation: 'modification-request',
              forProject: new UniqueEntityID(projetId),
              createdBy: new UniqueEntityID(porteur.id),
              filename: fichier.filename,
              contents: fichier.contents,
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
            new UniqueEntityID(projetId),
            (
              project: Project
            ): ResultAsync<
              string,
              AggregateHasBeenUpdatedSinceError | ProjectCannotBeUpdatedIfUnnotifiedError
            > => {
              return project
                .updateProducteur(porteur, nouveauProducteur)
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
                projectId: projetId,
                requestedBy: porteur.id,
                type: 'producteur',
                producteur: nouveauProducteur,
                justification,
                fileId,
                authority: 'dreal',
              },
            })
          )
        }
      )
  }
