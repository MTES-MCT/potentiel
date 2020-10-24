import {
  handleCandidateNotifiedForPeriode,
  handleProjectCertificateGenerated,
  handleProjectCertificateUpdated,
} from '../../modules/candidateNotification/eventHandlers'
import { CandidateNotifiedForPeriode } from '../../modules/candidateNotification/events'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
  ProjectCertificateUpdated,
} from '../../modules/project/events'
import { sendNotification } from '../emails.config'
import { eventStore } from '../eventStore.config'
import { appelOffreRepo, projectAdmissionKeyRepo, projectRepo } from '../repos.config'

eventStore.subscribe(
  CandidateNotifiedForPeriode.type,
  handleCandidateNotifiedForPeriode({
    eventBus: eventStore,
    sendNotification,
    saveProjectAdmissionKey: projectAdmissionKeyRepo.save,
    getPeriodeTitle: appelOffreRepo.getPeriodeTitle,
  })
)

const projectCertficateHandler = handleProjectCertificateGenerated({
  eventStore,
  findProjectById: projectRepo.findById,
})
eventStore.subscribe(ProjectCertificateGenerated.type, projectCertficateHandler)
eventStore.subscribe(ProjectCertificateGenerationFailed.type, projectCertficateHandler)

eventStore.subscribe(
  ProjectCertificateUpdated.type,
  handleProjectCertificateUpdated({
    eventBus: eventStore,
    sendNotification,
    findProjectById: projectRepo.findById,
    getUsersForProject: projectRepo.getUsers,
  })
)

console.log('Candidate Notification Event Handlers Initialized')
