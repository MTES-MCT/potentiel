import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok, Result } from '@core/utils'
import { EntityNotFoundError } from '../../shared'

export const statutsDemandeAnnulationAbandon = [
  'envoyée',
  'annulée',
  'accordée',
  'refusée',
] as const

export type StatutDemandeAnnulationAbandon = typeof statutsDemandeAnnulationAbandon[number]

type DemandeAnnulationAbandonArgs = {
  id: UniqueEntityID
  events?: DomainEvent[]
}

export type DemandeAnnulationAbandon = EventStoreAggregate & {
  statut: StatutDemandeAnnulationAbandon
  projetId: string
}

export const makeDemandeAnnulationAbandon = (
  args: DemandeAnnulationAbandonArgs
): Result<DemandeAnnulationAbandon, EntityNotFoundError> => {
  const { events = [], id } = args

  const agregatParDefaut: Partial<DemandeAnnulationAbandon> = {
    id,
    projetId: undefined,
    statut: undefined,
    pendingEvents: [],
  }

  const agregat = events.reduce((agregat, event) => {
    // switch (event.type) {
    //   case AbandonDemandé.type:
    //     return {
    //       ...agregat,
    //       statut: 'envoyée',
    //       projetId: event.payload.projetId,
    //     }
    //   case AbandonAnnulé.type:
    //     return { ...agregat, statut: 'annulée' }
    //   case AbandonConfirmé.type:
    //     return { ...agregat, statut: 'demande confirmée' }
    //   case AbandonAccordé.type:
    //     return { ...agregat, statut: 'accordée' }
    //   case AbandonRejeté.type:
    //     return { ...agregat, statut: 'refusée' }
    //   case ConfirmationAbandonDemandée.type:
    //     return { ...agregat, statut: 'en attente de confirmation' }
    //   case RejetAbandonAnnulé.type:
    //     return { ...agregat, statut: 'envoyée' }
    // default:
    return agregat
    // }
  }, agregatParDefaut) as DemandeAnnulationAbandon

  return ok(agregat)
}
