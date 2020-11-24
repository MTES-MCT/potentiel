import { handleProjectCertificateUploadedOrRegenerated } from '../../modules/notification'
import {
  ProjectCertificateRegenerated,
  ProjectCertificateUploaded,
} from '../../modules/project/events'
import { projectRepo, oldProjectRepo } from '../repos.config'
import { eventStore } from '../eventStore.config'
import { sendNotification } from '../emails.config'

eventStore.subscribe(
  ProjectCertificateUploaded.type,
  handleProjectCertificateUploadedOrRegenerated({
    sendNotification,
    projectRepo,
    getUsersForProject: oldProjectRepo.getUsers,
  })
)

eventStore.subscribe(
  ProjectCertificateRegenerated.type,
  handleProjectCertificateUploadedOrRegenerated({
    sendNotification,
    projectRepo,
    getUsersForProject: oldProjectRepo.getUsers,
  })
)

console.log('Notification Event Handlers Initialized')
export const notificationHandlersOk = true
