import { EventStore, Repository, TransactionalRepository } from '@core/domain'
import { errAsync, okAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject } from '@modules/file'
import { UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'

import { DemandeAbandon } from '../DemandeAbandon'

type Dépendances = {
  demandeAbandonRepo: TransactionalRepository<DemandeAbandon>
  publishToEventStore: EventStore['publish']
  fileRepo: Repository<FileObject>
}

type Commande = {
  user: User
  demandeAbandonId: string
  fichierRéponse: { contents: FileContents; filename: string }
}

export const makeRejeterDemandeAbandon =
  ({ publishToEventStore, demandeAbandonRepo, fileRepo }: Dépendances) =>
  ({ user, demandeAbandonId, fichierRéponse: { filename, contents } }: Commande) => {
    if (userIsNot(['admin', 'dgec-validateur'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return okAsync(null)
    // return demandeAbandonRepo.transaction(
    //   new UniqueEntityID(demandeAbandonId),
    //   (demandeAbandon) => {
    //     const { statut, projetId } = demandeAbandon

    //     if (!['envoyée', 'en-instruction', 'demande confirmée'].includes(statut)) {
    //       return errAsync(
    //         new RejeterDemandeAbandonError(
    //           demandeAbandon,
    //           'Seule une demande envoyée, en instruction ou en demande confirmée peut être rejetée.'
    //         )
    //       )
    //     }

    //     if (!projetId) {
    //       return errAsync(new InfraNotAvailableError())
    //     }

    //     return makeAndSaveFile({
    //       file: {
    //         designation: 'modification-request-response',
    //         forProject: new UniqueEntityID(projetId),
    //         createdBy: new UniqueEntityID(user.id),
    //         filename,
    //         contents,
    //       },
    //       fileRepo,
    //     }).andThen((fichierRéponseId) => {
    //       return publishToEventStore(
    //         new AbandonRejeté({
    //           payload: {
    //             demandeAbandonId,
    //             rejetéPar: user.id,
    //             fichierRéponseId,
    //             projetId,
    //           },
    //         })
    //       )
    //     })
    //   }
    // )
  }
