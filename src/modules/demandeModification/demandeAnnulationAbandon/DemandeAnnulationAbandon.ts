import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok, Result } from '@core/utils'
import { EntityNotFoundError } from '../../shared'
import { AnnulationAbandonDemandée, AnnulationAbandonAnnulée } from './events'

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
    switch (event.type) {
      case AnnulationAbandonDemandée.type:
        return {
          ...agregat,
          statut: 'envoyée',
          projetId: event.payload.projetId,
        }

      case AnnulationAbandonAnnulée.type:
        return { ...agregat, statut: 'annulée' }

      default:
        return agregat
    }
  }, agregatParDefaut) as DemandeAnnulationAbandon

  return ok(agregat)
}
