import { getProjectAppelOffre } from '@config/queries.config'
import {
  DomainEvent,
  EventStore,
  Repository,
  TransactionalRepository,
  UniqueEntityID,
} from '@core/domain'
import { makeEventStoreRepo, makeEventStoreTransactionalRepo } from '@core/utils'
import { BuildProjectIdentifier, makeProject, Project } from '@modules/project'

export const makeProjectRepo = (
  eventStore: EventStore,
  buildProjectIdentifier: BuildProjectIdentifier
): Repository<Project> & TransactionalRepository<Project> => {
  // Classic EventStoreRepos take a makeAggregate function that only takes events and an id, to make a project we needs to bind the appelsOffre argument as well
  const makeProjectFromHistory = (args: { events: DomainEvent[]; id: UniqueEntityID }) =>
    makeProject({
      history: args.events,
      projectId: args.id,
      getProjectAppelOffre,
      buildProjectIdentifier,
    })

  // ProjectRepo is a composition of EventStoreRepo and EventStoreTransactionalRepo
  return {
    ...makeEventStoreRepo<Project>({
      eventStore,
      makeAggregate: makeProjectFromHistory,
    }),
    ...makeEventStoreTransactionalRepo<Project>({
      eventStore,
      makeAggregate: makeProjectFromHistory,
    }),
  }
}
