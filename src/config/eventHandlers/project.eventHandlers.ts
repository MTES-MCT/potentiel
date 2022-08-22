import { DomainEvent } from '@core/domain'
import { DélaiAccordé } from '@modules/demandeModification'
import { LegacyModificationImported } from '@modules/modificationRequest'
import {
  handleLegacyModificationImported,
  handlePeriodeNotified,
  handleProjectCertificateObsolete,
  handleProjectRawDataImported,
  makeOnDélaiAccordé,
  PeriodeNotified,
  ProjectCertificateObsolete,
  ProjectRawDataImported,
} from '@modules/project'
import { subscribeToRedis } from '../eventBus.config'
import { eventStore } from '../eventStore.config'
import {
  findProjectByIdentifiers,
  getProjectAppelOffre,
  getUnnotifiedProjectsForPeriode,
} from '../queries.config'
import { projectRepo } from '../repos.config'
import { generateCertificate } from '../useCases.config'

eventStore.subscribe(
  PeriodeNotified.type,
  handlePeriodeNotified({
    projectRepo,
    generateCertificate,
    getUnnotifiedProjectsForPeriode,
    getProjectAppelOffre,
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

const onDélaiAccordéHandler = makeOnDélaiAccordé({
  projectRepo,
  publishToEventStore: eventStore.publish,
})

const onDélaiAccordé = async (event: DomainEvent) => {
  if (!(event instanceof DélaiAccordé)) {
    return Promise.resolve()
  }

  return await onDélaiAccordéHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e)
  )
}
subscribeToRedis(onDélaiAccordé, 'Project.onDélaiAccordé')

console.log('Project Event Handlers Initialized')
export const projectHandlersOk = true
