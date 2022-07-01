import { DomainEvent, UniqueEntityID, EventStoreAggregate } from '@core/domain'
import { ok, Result } from '@core/utils'
import { DélaiAccordé } from './accorder'
import { DélaiAnnulé } from './annuler'
import { DélaiDemandé } from './demander'
import { EntityNotFoundError } from '../../shared'

export type StatutDemandeDélai = 'envoyée' | 'annulée' | 'accordée' | 'refusée' | 'en-instruction'

type DemandeDélaiArgs = {
  id: UniqueEntityID
  events?: DomainEvent[]
}

export type DemandeDélai = EventStoreAggregate & {
  statut: StatutDemandeDélai | undefined
  projetId: string | undefined
}

export const makeDemandeDélai = (
  args: DemandeDélaiArgs
): Result<DemandeDélai, EntityNotFoundError> => {
  const { events = [], id } = args

  const agregatParDefaut: DemandeDélai = {
    projetId: undefined,
    statut: undefined,
    id,
    pendingEvents: [],
  }

  const agregat: DemandeDélai = events.reduce((agregat, event) => {
    switch (event.type) {
      case DélaiDemandé.type:
        return {
          ...agregat,
          statut: 'envoyée',
          projetId: event.payload.projetId,
        }
      case DélaiAccordé.type:
        return { ...agregat, statut: 'accordée' }
      case DélaiAnnulé.type:
        return { ...agregat, statut: 'annulée' }
      default:
        return agregat
    }
  }, agregatParDefaut)

  return ok(agregat)
}
