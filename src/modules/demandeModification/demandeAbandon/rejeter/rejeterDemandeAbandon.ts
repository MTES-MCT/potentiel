import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'

import { DemandeAbandon } from '../DemandeAbandon'
import { AbandonRejeté } from '../events'
import { RejeterDemandeAbandonError } from './RejeterDemandeAbandonError'

type MakeRejeterDemandeAbandonProps = {
  demandeAbandonRepo: TransactionalRepository<DemandeAbandon>
  publishToEventStore: EventStore['publish']
  fileRepo: Repository<FileObject>
}

type RejeterDemandeAbandonProps = {
  user: User
  demandeAbandonId: string
  fichierRéponse: { contents: FileContents; filename: string }
}

export const makeRejeterDemandeAbandon =
  ({ publishToEventStore, demandeAbandonRepo, fileRepo }: MakeRejeterDemandeAbandonProps) =>
  ({
    user,
    demandeAbandonId,
    fichierRéponse: { filename, contents },
  }: RejeterDemandeAbandonProps) => {
    if (userIsNot(['admin', 'dgec-validateur'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeAbandonRepo.transaction(
      new UniqueEntityID(demandeAbandonId),
      (demandeAbandon) => {
        const { statut, projetId } = demandeAbandon

        if (statut !== 'envoyée' && statut !== 'en-instruction') {
          return errAsync(
            new RejeterDemandeAbandonError(
              demandeAbandon,
              'Seul une demande envoyée ou en instruction peut être rejetée.'
            )
          )
        }

        if (!projetId) {
          return errAsync(new InfraNotAvailableError())
        }

        return makeAndSaveFile({
          file: {
            designation: 'modification-request-response',
            forProject: new UniqueEntityID(projetId),
            createdBy: new UniqueEntityID(user.id),
            filename,
            contents,
          },
          fileRepo,
        }).andThen((fichierRéponseId) => {
          return publishToEventStore(
            new AbandonRejeté({
              payload: {
                demandeAbandonId,
                rejetéPar: user.id,
                fichierRéponseId,
                projetId,
              },
            })
          )
        })
      }
    )
  }
