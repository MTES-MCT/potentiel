import { LegacyModificationImported, ModificationReceived } from '@modules/modificationRequest'
import {
  handlePeriodeNotified,
  handleProjectRawDataImported,
  handleLegacyModificationImported,
  PeriodeNotified,
  ProjectRawDataImported,
} from '@modules/project'
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
  ProjectRawDataImported.type,
  handleProjectRawDataImported({
    findProjectByIdentifiers,
    projectRepo,
  })
)

eventStore.subscribe(
  LegacyModificationImported.type,
  handleLegacyModificationImported({
    projectRepo,
  })
)

console.log('Project Event Handlers Initialized')
export const projectHandlersOk = true
