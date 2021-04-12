import {
  handleCandidateNotifiedForPeriode,
  handleProjectCertificateGeneratedOrFailed,
} from '../../modules/candidateNotification/eventHandlers'
import { CandidateNotifiedForPeriode } from '../../modules/candidateNotification/events'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
} from '../../modules/project/events'
import { sendNotification } from '../emails.config'
import { eventStore } from '../eventStore.config'
import {
  oldAppelOffreRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
} from '../repos.config'

eventStore.subscribe(
  CandidateNotifiedForPeriode.type,
  handleCandidateNotifiedForPeriode({
    eventBus: eventStore,
    sendNotification,
    saveProjectAdmissionKey: projectAdmissionKeyRepo.save,
    getPeriodeTitle: oldAppelOffreRepo.getPeriodeTitle,
  })
)

const projectCertficateHandler = handleProjectCertificateGeneratedOrFailed({
  candidateNotificationRepo,
})
eventStore.subscribe(ProjectCertificateGenerated.type, projectCertficateHandler)
eventStore.subscribe(ProjectCertificateGenerationFailed.type, projectCertficateHandler)

console.log('Candidate Notification Event Handlers Initialized')
export const candidateNotificationHandlersOk = true
