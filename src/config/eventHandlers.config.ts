import {
  handleCandidateNotifiedForPeriode,
  handlePeriodeNotified,
  handleProjectCertificateGenerated,
  handleProjectNotified,
} from '../modules/project/eventHandlers'
import { makeGenerateCertificate } from '../modules/project/generateCertificate'
import { buildCertificate } from '../views/certificates'
import { fileService } from './fileStorage.config'
import {
  projectRepo,
  appelOffreRepo,
  projectAdmissionKeyRepo,
} from './repos.config'
import { eventStore } from './eventStore.config'
import { getUnnotifiedProjectsForPeriode } from './queries.config'
import { sendNotification } from './emails.config'

export const generateCertificate = makeGenerateCertificate({
  fileService,
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  buildCertificate,
})

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
