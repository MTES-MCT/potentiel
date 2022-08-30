import { User } from '@entities'
import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeAbandon } from '../DemandeAbandon'
import { errAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import { ConfirmationAbandonDemandée } from '../events'
import { DemanderConfirmationAbandonError } from './DemanderConfirmationAbandonError'

type DemanderConfirmationAbandonProps = {
  user: User
  demandeAbandonId: string
  fichierRéponse: { contents: FileContents; filename: string }
}

type MakeDemanderConfirmationAbandonProps = {
  demandeAbandonRepo: Repository<DemandeAbandon> & TransactionalRepository<DemandeAbandon>
  publishToEventStore: EventStore['publish']
  fileRepo: Repository<FileObject>
}

export const makeDemanderConfirmationAbandon =
  ({ demandeAbandonRepo, publishToEventStore, fileRepo }: MakeDemanderConfirmationAbandonProps) =>
  ({ user, demandeAbandonId, fichierRéponse }: DemanderConfirmationAbandonProps) => {
    if (userIsNot(['admin', 'dgec-validateur'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeAbandonRepo
      .load(new UniqueEntityID(demandeAbandonId))
      .andThen((demandeAbandon) => {
        const { projetId } = demandeAbandon
        if (!projetId) return errAsync(new InfraNotAvailableError())

        const { statut } = demandeAbandon

        if (statut !== 'envoyée' && statut !== 'en-instruction') {
          return errAsync(
            new DemanderConfirmationAbandonError(
              demandeAbandon,
              'Seule une demande envoyée ou en instruction peut permettre de demander une confirmation'
            )
          )
        }

        return makeAndSaveFile({
          file: {
            designation: 'modification-request-response',
            forProject: new UniqueEntityID(projetId),
            createdBy: new UniqueEntityID(user.id),
            filename: fichierRéponse.filename,
            contents: fichierRéponse.contents,
          },
          fileRepo,
        }).andThen((fichierRéponseId) => {
          return publishToEventStore(
            new ConfirmationAbandonDemandée({
              payload: {
                demandéePar: user.id,
                projetId,
                demandeAbandonId,
                fichierRéponseId,
              },
            })
          )
        })
      })
  }
