import { EventBus, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync, wrapInfra } from '@core/utils'
import { User, formatCahierDesChargesRéférence } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '../../file'
import { Fournisseur } from '../../project'
import { Project } from '../../project/Project'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
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

export const makeRequestFournisseursModification =
  (deps: RequestFournisseurModificationDeps) => (args: RequestFournisseurModificationArgs) => {
    const { projectId, requestedBy, newFournisseurs, newEvaluationCarbone, justification, file } =
      args
    const { eventBus, shouldUserAccessProject, projectRepo, fileRepo } = deps

    return wrapInfra(
      shouldUserAccessProject({ projectId: projectId.toString(), user: requestedBy })
    )
      .andThen((userHasRightsToProject) => {
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
      })
      .andThen((fileId: string) =>
        projectRepo.transaction(projectId, (project: Project) =>
          project
            .updateFournisseurs(requestedBy, newFournisseurs, newEvaluationCarbone)
            .map(() => ({ fileId, project }))
        )
      )
      .andThen(({ fileId, project }) =>
        eventBus.publish(
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
              authority: 'dreal',
              cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
            },
          })
        )
      )
  }
