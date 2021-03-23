import { Repository, UniqueEntityID } from '../../../core/domain'
import { errAsync, logger, ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { FileContents, FileObject, makeAndSaveFile } from '../../file'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../shared'
import { ModificationRequest } from '../ModificationRequest'

interface RejectModificationRequestDeps {
  modificationRequestRepo: Repository<ModificationRequest>
  fileRepo: Repository<FileObject>
}

interface RejectModificationRequestArgs {
  modificationRequestId: UniqueEntityID
  versionDate: Date
  responseFile: { contents: FileContents; filename: string }
  rejectedBy: User
}

export const makeRejectModificationRequest = (deps: RejectModificationRequestDeps) => (
  args: RejectModificationRequestArgs
): ResultAsync<
  null,
  | AggregateHasBeenUpdatedSinceError
  | InfraNotAvailableError
  | EntityNotFoundError
  | UnauthorizedError
> => {
  const { fileRepo, modificationRequestRepo } = deps
  const { modificationRequestId, versionDate, responseFile, rejectedBy } = args
  const { contents, filename } = responseFile

  if (!['admin', 'dgec'].includes(rejectedBy.role)) {
    return errAsync(new UnauthorizedError())
  }

  return modificationRequestRepo
    .load(modificationRequestId)
    .andThen(
      (
        modificationRequest
      ): ResultAsync<
        { modificationRequest: ModificationRequest; responseFileId: string },
        AggregateHasBeenUpdatedSinceError | InfraNotAvailableError
      > => {
        if (modificationRequest.lastUpdatedOn.getTime() !== versionDate.getTime()) {
          return errAsync(new AggregateHasBeenUpdatedSinceError())
        }

        return makeAndSaveFile({
          file: {
            designation: 'modification-request-response',
            forProject: modificationRequest.projectId,
            createdBy: new UniqueEntityID(rejectedBy.id),
            filename,
            contents,
          },
          fileRepo,
        })
          .map((responseFileId) => ({ modificationRequest, responseFileId }))
          .mapErr((e: Error) => {
            logger.error(e)
            return new InfraNotAvailableError()
          })
      }
    )
    .andThen(({ modificationRequest, responseFileId }) => {
      return modificationRequest.reject(rejectedBy, responseFileId).map(() => modificationRequest)
    })
    .andThen((modificationRequest) => {
      return modificationRequestRepo.save(modificationRequest)
    })
}
