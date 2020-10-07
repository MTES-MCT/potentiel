import {
  handleCandidateNotifiedForPeriode,
  handlePeriodeNotified,
  handleProjectCertificateGenerated,
  handleProjectNotified,
} from '../modules/project/eventHandlers'

import {
  projectRepo,
  appelOffreRepo,
  projectAdmissionKeyRepo,
} from './repos.config'
import { eventStore } from './eventStore.config'
import { getUnnotifiedProjectsForPeriode } from './queries.config'
import { sendNotification } from './emails.config'
import { generateCertificate } from './useCases.config'

handlePeriodeNotified(eventStore, getUnnotifiedProjectsForPeriode)
handleProjectCertificateGenerated(eventStore, {
  findProjectById: projectRepo.findById,
})
handleProjectNotified(eventStore, {
  generateCertificate,
  getFamille: appelOffreRepo.getFamille,
})
handleCandidateNotifiedForPeriode(eventStore, {
  sendNotification,
  saveProjectAdmissionKey: projectAdmissionKeyRepo.save,
  getPeriodeTitle: appelOffreRepo.getPeriodeTitle,
})
