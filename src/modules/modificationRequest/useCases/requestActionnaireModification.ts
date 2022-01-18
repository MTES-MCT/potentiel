import { EventBus, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { combine, errAsync, logger, okAsync, ResultAsync, wrapInfra } from '@core/utils'
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
import { ModificationReceived, ModificationRequested } from '../events'
import {
  GetProjectAppelOffreId,
  HasProjectGarantieFinanciere,
  IsProjectParticipatif,
} from '../queries'

interface RequestActionnaireModificationDeps {
  eventBus: EventBus
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: TransactionalRepository<Project>
  fileRepo: Repository<FileObject>
  isProjectParticipatif: IsProjectParticipatif
  hasProjectGarantieFinanciere: HasProjectGarantieFinanciere
  getProjectAppelOffreId: GetProjectAppelOffreId
}

interface RequestActionnaireModificationArgs {
  projectId: UniqueEntityID
  requestedBy: User
  newActionnaire: string
  justification?: string
  file?: { contents: FileContents; filename: string }
}

export const makeRequestActionnaireModification = (deps: RequestActionnaireModificationDeps) => (
  args: RequestActionnaireModificationArgs
): ResultAsync<
  null,
  | AggregateHasBeenUpdatedSinceError
  | InfraNotAvailableError
  | EntityNotFoundError
  | UnauthorizedError
> => {
  const { projectId, requestedBy, newActionnaire, justification, file } = args
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
      (
        fileId: string
      ): ResultAsync<
        { requiresAuthorization: boolean; fileId: string },
        InfraNotAvailableError | EntityNotFoundError
      > =>
        deps.getProjectAppelOffreId(projectId.toString()).andThen((appelOffreId) => {
          if (appelOffreId === 'Eolien') {
            return combine([
              deps.hasProjectGarantieFinanciere(projectId.toString()),
              deps.isProjectParticipatif(projectId.toString()),
            ]).map(([hasGarantieFinanciere, isProjectParticipatif]) => ({
              requiresAuthorization: !hasGarantieFinanciere || isProjectParticipatif,
              fileId,
            }))
          }

          return okAsync({ requiresAuthorization: false, fileId })
        })
    )
    .andThen(({ requiresAuthorization, fileId }) => {
      if (requiresAuthorization) {
        return eventBus.publish(
          new ModificationRequested({
            payload: {
              modificationRequestId: new UniqueEntityID().toString(),
              projectId: projectId.toString(),
              requestedBy: requestedBy.id,
              type: 'actionnaire',
              actionnaire: newActionnaire,
              justification,
              fileId,
              authority: 'dreal',
            },
          })
        )
      }

      return projectRepo
        .transaction(
          projectId,
          (
            project: Project
          ): ResultAsync<
            string,
            AggregateHasBeenUpdatedSinceError | ProjectCannotBeUpdatedIfUnnotifiedError
          > => {
            return project
              .updateActionnaire(requestedBy, newActionnaire)
              .asyncMap(async () => fileId)
          }
        )
        .andThen(() =>
          eventBus.publish(
            new ModificationReceived({
              payload: {
                modificationRequestId: new UniqueEntityID().toString(),
                projectId: projectId.toString(),
                requestedBy: requestedBy.id,
                type: 'actionnaire',
                actionnaire: newActionnaire,
                justification,
                fileId,
                authority: 'dreal',
              },
            })
          )
        )
    })
}
