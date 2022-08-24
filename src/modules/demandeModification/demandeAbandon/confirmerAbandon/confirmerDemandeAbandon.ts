import { User } from '@entities'
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeAbandon } from '../DemandeAbandon'
import { errAsync, wrapInfra } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'
import { AbandonConfirmé } from '../events'
import { ConfirmerDemandeAbandonError } from './ConfirmerDemandeAbandonError'

type ConfirmerDemandeAbandonProps = {
  confirméPar: User
  demandeAbandonId: string
}

type MakeConfirmerDemandeAbandonProps = {
  demandeAbandonRepo: TransactionalRepository<DemandeAbandon>
  publishToEventStore: EventStore['publish']
  aAccèsAuProjet: (userId: string, projetId: string) => Promise<boolean>
}

export const makeConfirmerDemandeAbandon =
  ({ demandeAbandonRepo, publishToEventStore, aAccèsAuProjet }: MakeConfirmerDemandeAbandonProps) =>
  ({ confirméPar, demandeAbandonId }: ConfirmerDemandeAbandonProps) => {
    if (userIsNot(['porteur-projet'])(confirméPar)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeAbandonRepo.transaction(
      new UniqueEntityID(demandeAbandonId),
      (demandeAbandon) => {
        const { projetId } = demandeAbandon
        if (!projetId) return errAsync(new InfraNotAvailableError())

        return wrapInfra(aAccèsAuProjet(confirméPar.id, projetId)).andThen((userAAccèsAuProjet) => {
          if (!userAAccèsAuProjet) return errAsync(new UnauthorizedError())

          const { statut } = demandeAbandon
          if (statut !== 'en attente de confirmation') {
            return errAsync(
              new ConfirmerDemandeAbandonError(
                demandeAbandon,
                'Seule une demande en attente de confirmation peut être confirmée'
              )
            )
          }

          return publishToEventStore(
            new AbandonConfirmé({
              payload: {
                confirméPar: confirméPar.id,
                projetId,
                demandeAbandonId,
              },
            })
          )
        })
      }
    )
  }
