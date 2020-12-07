import { Repository, UniqueEntityID } from '../../../core/domain'
import { err, errAsync, ok, Result, ResultAsync } from '../../../core/utils'
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
  newNotificationDate: Date
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
  const {
    modificationRequestId,
    versionDate,
    responseFile,
    submittedBy,
    newNotificationDate,
  } = args

  if (!['admin', 'dgec'].includes(submittedBy.role)) {
    return errAsync(new UnauthorizedError())
  }

  return modificationRequestRepo
    .load(modificationRequestId)
    .andThen(
      (modificationRequest): Result<ModificationRequest, AggregateHasBeenUpdatedSinceError> => {
        if (modificationRequest.lastUpdatedOn.getTime() !== versionDate.getTime()) {
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
        .andThen(() => project.setNotificationDate(submittedBy, newNotificationDate.getTime()))
        .map(() => ({ project, modificationRequest }))
    })
    .andThen(({ project, modificationRequest }) => {
      return modificationRequest
        .acceptRecours(submittedBy)
        .map(() => ({ project, modificationRequest }))
    })
    .andThen(({ project, modificationRequest }) => {
      return projectRepo.save(project).map(() => modificationRequest)
    })
    .andThen((modificationRequest) => {
      return modificationRequestRepo.save(modificationRequest)
    })
    .map(() => null)
}
