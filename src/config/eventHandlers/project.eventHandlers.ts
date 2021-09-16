import { ModificationReceived } from '../../modules/modificationRequest'
import {
  handleModificationReceived,
  handlePeriodeNotified,
} from '../../modules/project/eventHandlers'
import { handleProjectRawDataImported } from '../../modules/project/eventHandlers/handleProjectRawDataImported'
import { PeriodeNotified, ProjectRawDataImported } from '../../modules/project/events'
import { eventStore } from '../eventStore.config'
import { getUnnotifiedProjectsForPeriode, findProjectByIdentifiers } from '../queries.config'
import { projectRepo } from '../repos.config'
import { generateCertificate } from '../useCases.config'

eventStore.subscribe(
  PeriodeNotified.type,
  handlePeriodeNotified({
    projectRepo,
    generateCertificate,
    getUnnotifiedProjectsForPeriode,
  })
)

eventStore.subscribe(
  ModificationReceived.type,
  handleModificationReceived({
    eventBus: eventStore,
  })
)

eventStore.subscribe(
  ProjectRawDataImported.type,
  handleProjectRawDataImported({
    findProjectByIdentifiers,
    projectRepo,
  })
)

console.log('Project Event Handlers Initialized')
export const projectHandlersOk = true
