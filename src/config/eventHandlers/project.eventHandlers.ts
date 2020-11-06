import {
  handlePeriodeNotified,
  handleProjectDataCorrected,
  handleProjectNotified,
} from '../../modules/project/eventHandlers'
import { handleProjectNotificationDateSet } from '../../modules/project/eventHandlers/handleProjectNotificationDateSet'
import {
  PeriodeNotified,
  ProjectDataCorrected,
  ProjectNotificationDateSet,
  ProjectNotified,
  ProjectReimported,
} from '../../modules/project/events'
import { eventStore } from '../eventStore.config'
import { getUnnotifiedProjectsForPeriode } from '../queries.config'
import { appelOffreRepo, projectRepo } from '../repos.config'
import { generateCertificate } from '../useCases.config'

const projectNotificationHandler = handleProjectNotificationDateSet({
  eventBus: eventStore,
  findProjectById: projectRepo.findById,
  getFamille: appelOffreRepo.getFamille,
})
eventStore.subscribe(ProjectNotificationDateSet.type, projectNotificationHandler)
eventStore.subscribe(ProjectNotified.type, projectNotificationHandler)

eventStore.subscribe(
  PeriodeNotified.type,
  handlePeriodeNotified({
    eventStore,
    getUnnotifiedProjectsForPeriode,
  })
)

eventStore.subscribe(
  ProjectNotified.type,
  handleProjectNotified({
    eventBus: eventStore,
    generateCertificate,
    getFamille: appelOffreRepo.getFamille,
  })
)

const projectDataUpdatedHandler = handleProjectDataCorrected({
  eventBus: eventStore,
  generateCertificate,
})
eventStore.subscribe(ProjectReimported.type, projectDataUpdatedHandler)
eventStore.subscribe(ProjectDataCorrected.type, projectDataUpdatedHandler)

console.log('Project Event Handlers Initialized')
