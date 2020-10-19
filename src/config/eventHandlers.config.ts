import {
  handleProjectCertificateGenerated,
  handleProjectNotified,
} from '../modules/project/eventHandlers'
import { eventStore } from './eventStore.config'
import { appelOffreRepo, projectRepo } from './repos.config'
import { generateCertificate } from './useCases.config'

handleProjectCertificateGenerated(eventStore, {
  findProjectById: projectRepo.findById,
})
handleProjectNotified(eventStore, {
  generateCertificate,
  getFamille: appelOffreRepo.getFamille,
})

console.log('Event Handlers Initialized')
