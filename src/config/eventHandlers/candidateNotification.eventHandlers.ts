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
import { appelOffreRepo, candidateNotificationRepo, projectAdmissionKeyRepo } from '../repos.config'
import { logger } from '../../core/utils'

eventStore.subscribe(
  CandidateNotifiedForPeriode.type,
  handleCandidateNotifiedForPeriode({
    eventBus: eventStore,
    sendNotification,
    saveProjectAdmissionKey: projectAdmissionKeyRepo.save,
    getPeriodeTitle: appelOffreRepo.getPeriodeTitle,
  })
)

const projectCertficateHandler = handleProjectCertificateGeneratedOrFailed({
  candidateNotificationRepo,
})
eventStore.subscribe(ProjectCertificateGenerated.type, projectCertficateHandler)
eventStore.subscribe(ProjectCertificateGenerationFailed.type, projectCertficateHandler)

logger.info('Candidate Notification Event Handlers Initialized')
export const candidateNotificationHandlersOk = true
