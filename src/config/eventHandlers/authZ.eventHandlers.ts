import { handleProjectImported, handleUserCreated } from '@modules/authZ'
import { ProjectImported, ProjectReimported } from '../../modules/project/events'
import { UserCreated } from '../../modules/users'
import { eventStore } from '../eventStore.config'
import {
  getNonLegacyProjectsByContactEmail,
  getUserByEmail,
  isPeriodeLegacy,
} from '../queries.config'

const projectImportHandler = handleProjectImported({
  eventBus: eventStore,
  getUserByEmail,
  isPeriodeLegacy,
})

eventStore.subscribe(ProjectImported.type, projectImportHandler)

eventStore.subscribe(ProjectReimported.type, projectImportHandler)

eventStore.subscribe(
  UserCreated.type,
  handleUserCreated({
    getNonLegacyProjectsByContactEmail,
    eventBus: eventStore,
  })
)

console.log('AuthZ Event Handlers Initialized')
export const authZHandlersOk = true
