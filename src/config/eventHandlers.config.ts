import { handleProjectNotified } from '../modules/project/eventHandlers'
import { eventStore } from './eventStore.config'
import { appelOffreRepo } from './repos.config'
import { generateCertificate } from './useCases.config'

handleProjectNotified(eventStore, {
  generateCertificate,
  getFamille: appelOffreRepo.getFamille,
})

console.log('Event Handlers Initialized')
