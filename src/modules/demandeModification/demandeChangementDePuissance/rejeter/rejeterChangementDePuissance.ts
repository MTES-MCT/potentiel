import { Repository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import {
  AggregateHasBeenUpdatedSinceError,
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
  fichierRéponse?: { contents: FileContents; filename: string }
  utilisateur: User
}

export const makeRejeterChangementDePuissance =
  ({ modificationRequestRepo, fileRepo }: Dépendances) =>
  ({ demandeId, versionDate, fichierRéponse, utilisateur }: Commande) => {
    if (!['admin', 'dgec-validateur', 'dreal'].includes(utilisateur.role)) {
      return errAsync(new UnauthorizedError())
    }

    return modificationRequestRepo
      .load(demandeId)
      .andThen((demande) => {
        if (demande.lastUpdatedOn && demande.lastUpdatedOn.getTime() !== versionDate.getTime()) {
          return errAsync(new AggregateHasBeenUpdatedSinceError())
        }

        if (!fichierRéponse) return okAsync({ demande, fichierRéponseId: '' })

        return makeAndSaveFile({
          file: {
            designation: 'modification-request-response',
            forProject: demande.projectId,
            createdBy: new UniqueEntityID(utilisateur.id),
            filename: fichierRéponse.filename,
            contents: fichierRéponse.contents,
          },
          fileRepo,
        })
          .map((fichierRéponseId) => ({ demande, fichierRéponseId }))
          .mapErr((e: Error) => {
            logger.error(e)
            return new InfraNotAvailableError()
          })
      })
      .andThen(({ demande, fichierRéponseId }) => {
        return demande.reject(utilisateur, fichierRéponseId).map(() => demande)
      })
      .andThen((demande) => {
        return modificationRequestRepo.save(demande)
      })
  }
