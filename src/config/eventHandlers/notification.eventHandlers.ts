import {
  handleProjectCertificateUpdatedOrRegenerated,
  handleModificationRequestStatusChanged,
  handleModificationRequested,
} from '../../modules/notification'
import {
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
} from '../../modules/project/events'
import { projectRepo, oldProjectRepo } from '../repos.config'
import {
  getModificationRequestInfoForStatusNotification,
  getInfoForModificationRequested,
} from '../queries.config'
import { eventStore } from '../eventStore.config'
import { sendNotification } from '../emails.config'
import {
  ModificationRequested,
  ModificationRequestAccepted,
  ModificationRequestInstructionStarted,
} from '../../modules/modificationRequest'

const projectCertificateChangeHandler = handleProjectCertificateUpdatedOrRegenerated({
  sendNotification,
  projectRepo,
  getUsersForProject: oldProjectRepo.getUsers,
})

eventStore.subscribe(ProjectCertificateUpdated.type, projectCertificateChangeHandler)
eventStore.subscribe(ProjectCertificateRegenerated.type, projectCertificateChangeHandler)

const modificationRequestStatusChangeHandler = handleModificationRequestStatusChanged({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
})
eventStore.subscribe(
  ModificationRequestInstructionStarted.type,
  modificationRequestStatusChangeHandler
)
eventStore.subscribe(ModificationRequestAccepted.type, modificationRequestStatusChangeHandler)

eventStore.subscribe(
  ModificationRequested.type,
  handleModificationRequested({
    sendNotification,
    getInfoForModificationRequested,
  })
)

console.log('Notification Event Handlers Initialized')
export const notificationHandlersOk = true
