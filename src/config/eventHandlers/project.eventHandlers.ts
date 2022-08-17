import { DomainEvent } from '@core/domain'
import { AccordDemandeDélaiAnnulé, DélaiAccordé } from '@modules/demandeModification'
import { LegacyModificationImported } from '@modules/modificationRequest'
import {
  handleLegacyModificationImported,
  handlePeriodeNotified,
  handleProjectCertificateObsolete,
  handleProjectRawDataImported,
  makeOnAccordDemandeDélaiAnnulé,
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

const onAccordDemandeDélaiAnnuléHandler = makeOnAccordDemandeDélaiAnnulé({
  projectRepo,
  publishToEventStore: eventStore.publish,
})

const onAccordDemandeDélaiAnnulé = async (event: DomainEvent) => {
  if (!(event instanceof AccordDemandeDélaiAnnulé)) {
    return Promise.resolve()
  }

  return await onAccordDemandeDélaiAnnuléHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e)
  )
}
subscribeToRedis(onAccordDemandeDélaiAnnulé, 'Project.onAccordDemandeDélaiAnnulé')

console.log('Project Event Handlers Initialized')
export const projectHandlersOk = true
