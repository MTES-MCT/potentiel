import {
  DomainEvent,
  Repository,
  TransactionalRepository,
  UniqueEntityID,
} from '../../../core/domain'
import { EventStore } from '../../../modules/eventStore'
import { makeEventStoreRepo } from '../../../modules/eventStore/makeEventStoreRepo'
import { makeEventStoreTransactionalRepo } from '../../../modules/eventStore/makeEventStoreTransactionalRepo'
import { makeModificationRequest, ModificationRequest } from '../../../modules/modificationRequest'

export const makeModificationRequestRepo = (
  eventStore: EventStore
): Repository<ModificationRequest> & TransactionalRepository<ModificationRequest> => {
  // Classic EventStoreRepos take a makeAggregate function that only takes events and an id, to make a project we needs to bind the appelsOffre argument as well
  const makeModificationRequestFromHistory = (args: {
    events: DomainEvent[]
    id: UniqueEntityID
  }) => makeModificationRequest({ history: args.events, modificationRequestId: args.id })

  // ModificationRequestRepo is a composition of EventStoreRepo and EventStoreTransactionalRepo
  return {
    ...makeEventStoreRepo<ModificationRequest>({
      eventStore,
      makeAggregate: makeModificationRequestFromHistory,
    }),
    ...makeEventStoreTransactionalRepo<ModificationRequest>({
      eventStore,
      makeAggregate: makeModificationRequestFromHistory,
    }),
  }
}
