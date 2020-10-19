import {
  handleCandidateNotifiedForPeriode,
  handlePeriodeNotified,
  handleProjectCertificateGenerated,
  handleProjectNotified,
} from '../../modules/project/eventHandlers'
import { handleProjectNotificationDateSet } from '../../modules/project/eventHandlers/handleProjectNotificationDateSet'
import {
  CandidateNotifiedForPeriode,
  PeriodeNotified,
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
  ProjectNotificationDateSet,
  ProjectNotified,
} from '../../modules/project/events'
import { eventStore } from '../eventStore.config'
import { getUnnotifiedProjectsForPeriode } from '../queries.config'
import {
  appelOffreRepo,
  projectAdmissionKeyRepo,
  projectRepo,
} from '../repos.config'
import { sendNotification } from '../emails.config'
import { generateCertificate } from '../useCases.config'

eventStore.subscribe(
  ProjectNotificationDateSet.type,
  handleProjectNotificationDateSet({
    eventBus: eventStore,
    findProjectById: projectRepo.findById,
    getFamille: appelOffreRepo.getFamille,
  })
)

eventStore.subscribe(
  CandidateNotifiedForPeriode.type,
  handleCandidateNotifiedForPeriode({
    eventBus: eventStore,
    sendNotification,
    saveProjectAdmissionKey: projectAdmissionKeyRepo.save,
    getPeriodeTitle: appelOffreRepo.getPeriodeTitle,
  })
)

eventStore.subscribe(
  PeriodeNotified.type,
  handlePeriodeNotified({
    eventStore,
    getUnnotifiedProjectsForPeriode,
  })
)

const projectCertficateHandler = handleProjectCertificateGenerated({
  eventStore,
  findProjectById: projectRepo.findById,
})
eventStore.subscribe(ProjectCertificateGenerated.type, projectCertficateHandler)
eventStore.subscribe(
  ProjectCertificateGenerationFailed.type,
  projectCertficateHandler
)

eventStore.subscribe(
  ProjectNotified.type,
  handleProjectNotified({
    eventBus: eventStore,
    generateCertificate,
    getFamille: appelOffreRepo.getFamille,
  })
)

console.log('Project Event Handlers Initialized')
