import { handleProjectImported } from '../../modules/authorization'
import { ProjectImported, ProjectReimported } from '../../modules/project/events'
import { eventStore } from '../eventStore.config'
import { userRepo } from '../repos.config'

eventStore.subscribe(
  ProjectImported.type,
  handleProjectImported({
    addProjectToUserWithEmail: userRepo.addProjectToUserWithEmail,
  })
)

eventStore.subscribe(
  ProjectReimported.type,
  handleProjectImported({
    addProjectToUserWithEmail: userRepo.addProjectToUserWithEmail,
  })
)

console.log('Authorization Event Handlers Initialized')
export const authorizationHandlersOk = true
