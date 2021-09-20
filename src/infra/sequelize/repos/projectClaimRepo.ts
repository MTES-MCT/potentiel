import {
  DomainEvent,
  Repository,
  TransactionalRepository,
  UniqueEntityID,
} from '../../../core/domain'
import { EventStore } from '../../../modules/eventStore'
import { makeEventStoreRepo } from '../../../modules/eventStore/makeEventStoreRepo'
import { makeEventStoreTransactionalRepo } from '../../../modules/eventStore/makeEventStoreTransactionalRepo'
import { makeProjectClaim, ProjectClaim } from '../../../modules/projectClaim'

export const makeProjectClaimRepo = (
  eventStore: EventStore
): Repository<ProjectClaim> & TransactionalRepository<ProjectClaim> => {
  const makeProjectClaimFromHistory = (args: {
    events: DomainEvent[]
    projectId: UniqueEntityID
  }) =>
    makeProjectClaim({
      events: args.events,
      id: args.projectId,
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
