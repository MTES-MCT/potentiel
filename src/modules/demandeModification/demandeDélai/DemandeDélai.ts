import { DomainEvent, UniqueEntityID, EventStoreAggregate } from '@core/domain'
import { err, ok, Result } from '@core/utils'
import { DélaiAnnulé, DélaiDemandé } from '../../modificationRequest'
import { EntityNotFoundError } from '../../shared'

export type StatutDemandeDélai = 'envoyée' | 'annulée' | 'accordée' | 'refusée' | 'en-instruction'

type DemandeDélaiArgs = {
  id: UniqueEntityID
  events?: DomainEvent[]
}

export type DemandeDélai = EventStoreAggregate & {
  statut: StatutDemandeDélai | undefined
  projet: { id: UniqueEntityID } | undefined
}

export const makeDemandeDélai = (
  args: DemandeDélaiArgs
): Result<DemandeDélai, EntityNotFoundError> => {
  const { events = [], id } = args

  const agregatParDefaut: DemandeDélai = {
    projet: undefined,
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
          projet: { id: new UniqueEntityID(event.payload.projetId) },
        }
      case DélaiAnnulé.type:
        return { ...agregat, statut: 'annulée' }
      default:
        return agregat
    }
  }, agregatParDefaut)

  return ok(agregat)
}
