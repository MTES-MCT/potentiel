import { LegacyModificationImported } from '@modules/modificationRequest'
import {
  handleLegacyModificationImported,
  handlePeriodeNotified,
  handleProjectCertificateObsolete,
  handleProjectRawDataImported,
  PeriodeNotified,
  ProjectCertificateObsolete,
  ProjectRawDataImported,
} from '@modules/project'
import { eventStore } from '../eventStore.config'
import {
  findProjectByIdentifiers,
  getUnnotifiedProjectsForPeriode,
  getProjectAppelOffre,
} from '../queries.config'
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
  ProjectCertificateObsolete.type,
  handleProjectCertificateObsolete({
    generateCertificate,
  })
)

eventStore.subscribe(
  ProjectRawDataImported.type,
  handleProjectRawDataImported({
    getProjectAppelOffre,
    findProjectByIdentifiers,
    projectRepo,
  })
)

eventStore.subscribe(
  LegacyModificationImported.type,
  handleLegacyModificationImported({
    projectRepo,
    getProjectAppelOffre,
  })
)

console.log('Project Event Handlers Initialized')
export const projectHandlersOk = true
