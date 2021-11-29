import {
  DomainEvent,
  EventStore,
  Repository,
  TransactionalRepository,
  UniqueEntityID,
} from '../../../core/domain'
import { makeEventStoreRepo, makeEventStoreTransactionalRepo } from '../../../core/utils'
import { makeProjectClaim, ProjectClaim } from '../../../modules/projectClaim'

export const makeProjectClaimRepo = (
  eventStore: EventStore
): Repository<ProjectClaim> & TransactionalRepository<ProjectClaim> => {
  const makeProjectClaimFromHistory = (args: { events: DomainEvent[]; id: UniqueEntityID }) =>
    makeProjectClaim({
      events: args.events,
      id: args.id,
    })

  return {
    ...makeEventStoreRepo<ProjectClaim>({
      eventStore,
      makeAggregate: makeProjectClaimFromHistory,
    }),
    ...makeEventStoreTransactionalRepo<ProjectClaim>({
      eventStore,
      makeAggregate: makeProjectClaimFromHistory,
    }),
  }
}
