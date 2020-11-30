import { Repository, UniqueEntityID } from '../../../core/domain'
import { err, ok, Result, ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { FileContents, FileObject, makeAndSaveFile } from '../../file'
import { Project } from '../../project/Project'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../shared'
import { ModificationRequest } from '../ModificationRequest'

interface AcceptRecoursDeps {
  modificationRequestRepo: Repository<ModificationRequest>
  projectRepo: Repository<Project>
  fileRepo: Repository<FileObject>
}

interface AcceptRecoursArgs {
  modificationRequestId: UniqueEntityID
  versionDate: Date
  responseFile: FileContents
  submittedBy: User
}

export const makeAcceptRecours = (deps: AcceptRecoursDeps) => (
  args: AcceptRecoursArgs
): ResultAsync<
  null,
  | AggregateHasBeenUpdatedSinceError
  | InfraNotAvailableError
  | EntityNotFoundError
  | UnauthorizedError
> => {
  const { fileRepo, modificationRequestRepo, projectRepo } = deps
  const { modificationRequestId, versionDate, responseFile, submittedBy } = args

  return modificationRequestRepo
    .load(modificationRequestId)
    .andThen(
      (modificationRequest): Result<ModificationRequest, AggregateHasBeenUpdatedSinceError> => {
        if (modificationRequest.lastUpdatedOn !== versionDate) {
          return err(new AggregateHasBeenUpdatedSinceError())
        }

        return ok(modificationRequest)
      }
    )
    .andThen((modificationRequest) => {
      return projectRepo
        .load(modificationRequest.projectId)
        .map((project) => ({ project, modificationRequest }))
    })
    .andThen(({ project, modificationRequest }) => {
      return makeAndSaveFile({
        file: {
          designation: 'attestation-designation',
          forProject: modificationRequest.projectId,
          createdBy: new UniqueEntityID(submittedBy.id),
          filename: project.certificateFilename,
          contents: responseFile,
        },
        fileRepo,
      })
        .map((certificateFileId) => ({ project, modificationRequest, certificateFileId }))
        .mapErr((e) => {
          console.error(e)
          return new InfraNotAvailableError()
        })
    })
    .andThen(({ project, modificationRequest, certificateFileId }) => {
      return project
        .grantClasse(submittedBy)
        .andThen(() => project.uploadCertificate(submittedBy, certificateFileId))
        .andThen(() => project.setNotificationDate(submittedBy, Date.now()))
        .map(() => ({ project, modificationRequest }))
    })
    .andThen(({ project, modificationRequest }) => {
      return modificationRequest.acceptRecours().map(() => ({ project, modificationRequest }))
    })
    .andThen(({ project, modificationRequest }) => {
      return projectRepo.save(project).map(() => modificationRequest)
    })
    .andThen((modificationRequest) => {
      return modificationRequestRepo.save(modificationRequest)
    })
    .map(() => null)
}
