import { Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors'
import { GFCertificateHasAlreadyBeenSentError } from '../errors/GFCertificateHasAlreadyBeenSent'
import { Project } from '../Project'

type UploadGFDeps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  projectRepo: TransactionalRepository<Project>
}

type UploadGFArgs = {
  projectId: string
  stepDate: Date
  file: {
    contents: FileContents
    filename: string
  }
  submittedBy: User
}

export const makeUploadGF =
  (deps: UploadGFDeps) =>
  (args: UploadGFArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { fileRepo, projectRepo, shouldUserAccessProject } = deps
    const { projectId, file, submittedBy, stepDate } = args
    const { filename, contents } = file

    return wrapInfra(shouldUserAccessProject({ projectId, user: submittedBy }))
      .andThen(
        (
          userHasRightsToProject
        ): ResultAsync<string, InfraNotAvailableError | UnauthorizedError> => {
          if (!userHasRightsToProject) return errAsync(new UnauthorizedError())

          const fileId = makeFileObject({
            designation: 'garantie-financiere',
            forProject: new UniqueEntityID(projectId),
            createdBy: new UniqueEntityID(submittedBy.id),
            filename,
            contents,
          })
            .asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))
            .mapErr((e: Error) => {
              logger.error(e)
              return new InfraNotAvailableError()
            })

          return fileId
        }
      )
      .andThen((fileId: string): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        return projectRepo.transaction(
          new UniqueEntityID(projectId),
          (
            project: Project
          ): ResultAsync<
            null,
            ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError
          > => {
            return project
              .uploadGarantiesFinancieres(stepDate, fileId, submittedBy)
              .asyncMap(async () => null)
          }
        )
      })
  }
