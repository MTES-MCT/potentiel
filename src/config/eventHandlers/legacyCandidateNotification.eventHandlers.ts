import { legacyCandidateNotificationRepo } from '../repos.config'
import { isPeriodeLegacy } from '../queries.config'
import { handleProjectImported } from '@modules/legacyCandidateNotification'
import { eventStore } from '../eventStore.config'
import { ProjectImported, ProjectReimported } from '@modules/project'

const projectImportedHandler = handleProjectImported({
  isPeriodeLegacy,
  legacyCandidateNotificationRepo,
})
eventStore.subscribe(ProjectImported.type, projectImportedHandler)
eventStore.subscribe(ProjectReimported.type, projectImportedHandler)

console.log('Legacy Candidate Notification Event Handlers Initialized')
export const legacyCandidateNotificationHandlersOk = true
