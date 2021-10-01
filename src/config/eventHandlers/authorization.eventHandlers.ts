import { handleProjectImported } from '../../modules/authorization'
import { ProjectImported, ProjectReimported } from '../../modules/project/events'
import { eventStore } from '../eventStore.config'
import { getUserByEmail, isPeriodeLegacy } from '../queries.config'

eventStore.subscribe(
  ProjectImported.type,
  handleProjectImported({
    eventBus: eventStore,
    getUserByEmail,
    isPeriodeLegacy,
  })
)

eventStore.subscribe(
  ProjectReimported.type,
  handleProjectImported({
    eventBus: eventStore,
    getUserByEmail,
    isPeriodeLegacy,
  })
)

console.log('Authorization Event Handlers Initialized')
export const authorizationHandlersOk = true
