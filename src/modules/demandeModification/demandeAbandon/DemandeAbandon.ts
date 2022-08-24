import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok, Result } from '@core/utils'
import { EntityNotFoundError } from '../../shared'
import {
  AbandonDemandé,
  AbandonAnnulé,
  AbandonConfirmé,
  AbandonAccordé,
  AbandonRejeté,
  ConfirmationAbandonDemandée,
} from './events'

export type StatutDemandeAbandon =
  | 'envoyée'
  | 'annulée'
  | 'accordée'
  | 'refusée'
  | 'en-instruction'
  | 'en attente de confirmation'
  | 'demande confirmée'

type DemandeAbandonArgs = {
  id: UniqueEntityID
  events?: DomainEvent[]
}

export type DemandeAbandon = EventStoreAggregate & {
  statut: StatutDemandeAbandon | undefined
  projetId: string | undefined
}

export const makeDemandeAbandon = (
  args: DemandeAbandonArgs
): Result<DemandeAbandon, EntityNotFoundError> => {
  const { events = [], id } = args

  const agregatParDefaut: DemandeAbandon = {
    id,
    projetId: undefined,
    statut: undefined,
    pendingEvents: [],
  }

  const agregat: DemandeAbandon = events.reduce((agregat, event) => {
    switch (event.type) {
      case AbandonDemandé.type:
        return {
          ...agregat,
          statut: 'envoyée',
          projetId: event.payload.projetId,
        }
      case AbandonAnnulé.type:
        return { ...agregat, statut: 'annulée' }
      case AbandonConfirmé.type:
        return { ...agregat, statut: 'demande confirmée' }
      case AbandonAccordé.type:
        return { ...agregat, statut: 'accordée' }
      case AbandonRejeté.type:
        return { ...agregat, statut: 'refusée' }
      case ConfirmationAbandonDemandée.type:
        return { ...agregat, statut: 'en attente de confirmation' }
      default:
        return agregat
    }
  }, agregatParDefaut)

  return ok(agregat)
}
