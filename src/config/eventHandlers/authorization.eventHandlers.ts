import { handleProjectImported } from '../../modules/authorization'
import { ProjectImported, ProjectReimported } from '../../modules/project/events'
import { eventStore } from '../eventStore.config'
import { getUserByEmail } from '../queries.config'

eventStore.subscribe(
  ProjectImported.type,
  handleProjectImported({
    eventBus: eventStore,
    getUserByEmail,
  })
)

eventStore.subscribe(
  ProjectReimported.type,
  handleProjectImported({
    eventBus: eventStore,
    getUserByEmail,
  })
)

console.log('Authorization Event Handlers Initialized')
export const authorizationHandlersOk = true
