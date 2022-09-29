import {
  ExceedsPuissanceMaxDuVolumeReserve,
  ExceedsRatiosChangementPuissance,
  PuissanceJustificationOrCourrierMissingError,
} from '..'
import { EventBus, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync, ok, ResultAsync, wrapInfra } from '@core/utils'
import { User, formatCahierDesChargesRéférence } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '../../file'
import { Project } from '@modules/project'
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
  getPuissanceProjet: (
    projectId: string
  ) => ResultAsync<number, EntityNotFoundError | InfraNotAvailableError>
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
      .andThen((fileId: string) => {
        return projectRepo.transaction(projectId, (project: Project) => {
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
            return project.updatePuissance(requestedBy, newPuissance).asyncMap(async () => ({
              newPuissanceIsAutoAccepted,
              fileId,
              project,
            }))
          }

          if (
            project.cahierDesCharges.type === 'modifié' &&
            project.cahierDesCharges.paruLe !== '30/08/2022' &&
            !fileId &&
            !justification
          ) {
            return errAsync(new PuissanceJustificationOrCourrierMissingError())
          }

          return okAsync({ newPuissanceIsAutoAccepted: false, fileId, project })
        })
      })
      .andThen(
        ({
          newPuissanceIsAutoAccepted,
          fileId,
          project,
        }): ResultAsync<null, AggregateHasBeenUpdatedSinceError | InfraNotAvailableError> => {
          const modificationRequestId = new UniqueEntityID().toString()

          return deps
            .getPuissanceProjet(projectId.toString())
            .orElse(() => ok(-1))
            .andThen((puissanceActuelle) => {
              const puissanceAuMomentDuDepot =
                puissanceActuelle !== -1 ? puissanceActuelle : undefined
              return eventBus.publish(
                newPuissanceIsAutoAccepted
                  ? new ModificationReceived({
                      payload: {
                        modificationRequestId,
                        projectId: projectId.toString(),
                        requestedBy: requestedBy.id,
                        type: 'puissance',
                        puissance: newPuissance,
                        puissanceAuMomentDuDepot,
                        justification,
                        fileId,
                        authority: 'dreal',
                        cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
                      },
                    })
                  : new ModificationRequested({
                      payload: {
                        modificationRequestId,
                        projectId: projectId.toString(),
                        requestedBy: requestedBy.id,
                        type: 'puissance',
                        puissance: newPuissance,
                        puissanceAuMomentDuDepot,
                        justification,
                        fileId,
                        authority: 'dreal',
                        cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
                      },
                    })
              )
            })
        }
      )
  }
