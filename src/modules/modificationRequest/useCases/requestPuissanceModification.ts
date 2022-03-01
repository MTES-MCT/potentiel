import {
  ExceedsPuissanceMaxDuVolumeReserve,
  ExceedsRatiosChangementPuissance,
  PuissanceJustificationOrCourrierMissingError,
} from '..'
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
  exceedsRatiosChangementPuissance: ExceedsRatiosChangementPuissance
  exceedsPuissanceMaxDuVolumeReserve: ExceedsPuissanceMaxDuVolumeReserve
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
      exceedsPuissanceMaxDuVolumeReserve,
      exceedsRatiosChangementPuissance,
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
              if (!project.appelOffre) {
                return errAsync(new UnauthorizedError())
              }

              const exceedsRatios = exceedsRatiosChangementPuissance({
                nouvellePuissance: newPuissance,
                project: { ...project, technologie: project.data?.technologie ?? 'N/A' },
              })
              const exceedsPuissanceMax = exceedsPuissanceMaxDuVolumeReserve({
                nouvellePuissance: newPuissance,
                project: { ...project },
              })

              const newPuissanceIsAutoAccepted = !exceedsRatios && !exceedsPuissanceMax

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

          const modificationRequestId = new UniqueEntityID().toString()

          return eventBus.publish(
            newPuissanceIsAutoAccepted
              ? new ModificationReceived({
                  payload: {
                    modificationRequestId,
                    projectId: projectId.toString(),
                    requestedBy: requestedBy.id,
                    type: 'puissance',
                    puissance: newPuissance,
                    justification,
                    fileId,
                    authority: 'dreal',
                  },
                })
              : new ModificationRequested({
                  payload: {
                    modificationRequestId,
                    projectId: projectId.toString(),
                    requestedBy: requestedBy.id,
                    type: 'puissance',
                    puissance: newPuissance,
                    justification,
                    fileId,
                    authority: 'dreal',
                  },
                })
          )
        }
      )
  }
