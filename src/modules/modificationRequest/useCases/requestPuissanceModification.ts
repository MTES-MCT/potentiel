import { GetAutoAcceptRatiosForAppelOffre, PuissanceJustificationOrCourrierMissingError } from '..'
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
import { ModificationRequested, ModificationReceived } from '../events'

interface RequestPuissanceModificationDeps {
  eventBus: EventBus
  getAutoAcceptRatiosForAppelOffre: GetAutoAcceptRatiosForAppelOffre
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

export const makeRequestPuissanceModification =
  (deps: RequestPuissanceModificationDeps) =>
  (
    args: RequestPuissanceModificationArgs
  ): ResultAsync<
    null,
    | AggregateHasBeenUpdatedSinceError
    | InfraNotAvailableError
    | EntityNotFoundError
    | UnauthorizedError
  > => {
    const { projectId, requestedBy, newPuissance, justification, file } = args
    const {
      eventBus,
      shouldUserAccessProject,
      projectRepo,
      fileRepo,
      getAutoAcceptRatiosForAppelOffre,
    } = deps

    return wrapInfra(
      shouldUserAccessProject({ projectId: projectId.toString(), user: requestedBy })
    )
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
          { newPuissanceIsAutoAccepted: boolean; fileId: string },
          InfraNotAvailableError | UnauthorizedError
        > => {
          return projectRepo.transaction(
            projectId,
            (
              project: Project
            ): ResultAsync<
              { newPuissanceIsAutoAccepted: boolean; fileId: string },
              | AggregateHasBeenUpdatedSinceError
              | ProjectCannotBeUpdatedIfUnnotifiedError
              | PuissanceJustificationOrCourrierMissingError
            > => {
              const puissanceModificationRatio = newPuissance / project.puissanceInitiale

              if (!project.appelOffre) {
                return errAsync(new UnauthorizedError())
              }

              const { min: minAutoAcceptPuissanceRatio, max: maxAutoAcceptPuissanceRatio } =
                getAutoAcceptRatiosForAppelOffre(project.appelOffre)

              const newPuissanceIsAutoAccepted =
                puissanceModificationRatio >= minAutoAcceptPuissanceRatio &&
                puissanceModificationRatio <= maxAutoAcceptPuissanceRatio

              if (newPuissanceIsAutoAccepted) {
                return project.updatePuissance(requestedBy, newPuissance).asyncMap(async () => {
                  return {
                    newPuissanceIsAutoAccepted,
                    fileId,
                  }
                })
              }

              if ((!fileId || fileId === '') && !justification) {
                return errAsync(new PuissanceJustificationOrCourrierMissingError())
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
            authority: 'dreal' as 'dreal',
          }

          return eventBus.publish(
            newPuissanceIsAutoAccepted
              ? new ModificationReceived({ payload })
              : new ModificationRequested({ payload })
          )
        }
      )
  }
