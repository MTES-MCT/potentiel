import { Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors'
import { GFCertificateHasAlreadyBeenSentError } from '../errors/GFCertificateHasAlreadyBeenSent'
import { Project } from '../Project'

type SignalerDemandeDelaiDeps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  projectRepo: TransactionalRepository<Project>
}

type SignalerDemandeDelaiArgs = {
  projectId: string
  decidedOn: number
  isAccepted: boolean
  newCompletionDueOn: number
  notes?: string
  signaledBy: User
  file?: {
    contents: FileContents
    filename: string
  }
}

export const makeSignalerDemandeDelai =
  (deps: SignalerDemandeDelaiDeps) =>
  (
    args: SignalerDemandeDelaiArgs
  ): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projectRepo, fileRepo, shouldUserAccessProject } = deps
    const { projectId, decidedOn, newCompletionDueOn, isAccepted, notes, signaledBy, file } = args

    return wrapInfra(shouldUserAccessProject({ projectId, user: signaledBy }))
      .andThen(
        (
          userHasRightsToProject
        ): ResultAsync<
          { id: string; name: string } | null,
          InfraNotAvailableError | UnauthorizedError
        > => {
          if (!userHasRightsToProject) {
            return errAsync(new UnauthorizedError())
          }

          if (file) {
            const { filename, contents } = file
            const fileObject = makeFileObject({
              designation: 'other',
              forProject: new UniqueEntityID(projectId),
              createdBy: new UniqueEntityID(signaledBy.id),
              filename,
              contents,
            })
              .asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))
              .map((fileId) => ({ id: fileId, name: filename }))
              .mapErr((e: Error) => {
                logger.error(e)
                return new InfraNotAvailableError()
              })

            return fileObject
          }

          return okAsync(null)
        }
      )
      .andThen((file) => {
        return projectRepo.transaction(
          new UniqueEntityID(projectId),
          (
            project: Project
          ): ResultAsync<
            null,
            ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError
          > => {
            return project
              .signalerDemandeDelai({
                decidedOn: new Date(decidedOn),
                newCompletionDueOn: new Date(newCompletionDueOn),
                isAccepted,
                notes,
                attachments: file ? [file] : [],
                signaledBy,
              })
              .asyncMap(async () => null)
          }
        )
      })
  }
