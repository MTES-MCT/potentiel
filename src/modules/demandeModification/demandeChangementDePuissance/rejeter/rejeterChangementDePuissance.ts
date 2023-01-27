import { Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject } from '@modules/file'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '@modules/shared'
import { ModificationRequest } from '@modules/modificationRequest'

interface Dépendances {
  modificationRequestRepo: Repository<ModificationRequest>
  fileRepo: Repository<FileObject>
}

interface Commande {
  demandeId: UniqueEntityID
  versionDate: Date
  fichierRéponse: { contents: FileContents; filename: string }
  utilisateur: User
}

export const makeRejeterChangementDePuissance =
  ({ modificationRequestRepo, fileRepo }: Dépendances) =>
  ({
    demandeId,
    versionDate,
    fichierRéponse,
    utilisateur,
  }: Commande): ResultAsync<
    null,
    | AggregateHasBeenUpdatedSinceError
    | InfraNotAvailableError
    | EntityNotFoundError
    | UnauthorizedError
  > => {
    if (!['admin', 'dgec-validateur', 'dreal'].includes(utilisateur.role)) {
      return errAsync(new UnauthorizedError())
    }

    return okAsync(null)

    // modificationRequestRepo
    //   .load(modificationRequestId)
    //   .andThen(
    //     (
    //       modificationRequest
    //     ): ResultAsync<
    //       { modificationRequest: ModificationRequest; responseFileId: string },
    //       AggregateHasBeenUpdatedSinceError | InfraNotAvailableError
    //     > => {
    //       if (
    //         modificationRequest.lastUpdatedOn &&
    //         modificationRequest.lastUpdatedOn.getTime() !== versionDate.getTime()
    //       ) {
    //         return errAsync(new AggregateHasBeenUpdatedSinceError())
    //       }

    //       if (!responseFile) return okAsync({ modificationRequest, responseFileId: '' })

    //       return makeAndSaveFile({
    //         file: {
    //           designation: 'modification-request-response',
    //           forProject: modificationRequest.projectId,
    //           createdBy: new UniqueEntityID(rejectedBy.id),
    //           filename: responseFile.filename,
    //           contents: responseFile.contents,
    //         },
    //         fileRepo,
    //       })
    //         .map((responseFileId) => ({ modificationRequest, responseFileId }))
    //         .mapErr((e: Error) => {
    //           logger.error(e)
    //           return new InfraNotAvailableError()
    //         })
    //     }
    //   )
    //   .andThen(({ modificationRequest, responseFileId }) => {
    //     return modificationRequest.reject(rejectedBy, responseFileId).map(() => modificationRequest)
    //   })
    //   .andThen((modificationRequest) => {
    //     return modificationRequestRepo.save(modificationRequest)
    //   })
  }
