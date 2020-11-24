import { Repository, TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { appelsOffreStatic } from '../../../dataAccess/inMemory'
import { AppelOffre } from '../../../entities'
import { EventStore, StoredEvent } from '../../../modules/eventStore'
import { makeEventStoreRepo } from '../../../modules/eventStore/makeEventStoreRepo'
import { makeEventStoreTransactionalRepo } from '../../../modules/eventStore/makeEventStoreTransactionalRepo'
import { Project, makeProject } from '../../../modules/project/Project'

const appelsOffres: Record<AppelOffre['id'], AppelOffre> = appelsOffreStatic.reduce(
  (map, appelOffre) => {
    map[appelOffre.id] = appelOffre
    return map
  },
  {}
)

export const makeProjectRepo = (
  eventStore: EventStore
): Repository<Project> & TransactionalRepository<Project> => {
  // Classic EventStoreRepos take a makeAggregate function that only takes events and an id, to make a project we needs to bind the appelsOffre argument as well
  const makeProjectFromHistory = (args: { events: StoredEvent[]; id: UniqueEntityID }) =>
    makeProject({ history: args.events, projectId: args.id, appelsOffres })

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
