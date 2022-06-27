import { DomainEvent, UniqueEntityID, EventStoreAggregate } from '@core/domain'
import { err, ok, Result } from '@core/utils'
import { DélaiDemandé } from '../../modificationRequest'
import { EntityNotFoundError } from '../../shared'

export type StatutDemandeDélai = 'envoyée' | 'annulée' | 'accordée' | 'refusée' | 'en-instruction'

type DemandeDélaiArgs = {
  id: UniqueEntityID
  events?: DomainEvent[]
}

export type DemandeDélai = EventStoreAggregate & {
  statut: StatutDemandeDélai | undefined
}

export const makeDemandeDélai = (
  args: DemandeDélaiArgs
): Result<DemandeDélai, EntityNotFoundError> => {
  const { events, id } = args

  const agregatParDefaut: DemandeDélai = {
    statut: undefined,
    id,
    pendingEvents: [],
  }

  if (!events?.length) {
    return err(new EntityNotFoundError())
  }

  const agregat: DemandeDélai = events.reduce((agregat, event) => {
    switch (event.type) {
      case DélaiDemandé.type:
        return { ...agregat, statut: 'envoyée' }
      default:
        return agregat
    }
  }, agregatParDefaut)

  return ok(agregat)
}
