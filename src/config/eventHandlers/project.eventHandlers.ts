import { DomainEvent } from '@core/domain'
import {
  DélaiAccordé,
  AbandonAccordé,
  AnnulationAbandonAccordée,
} from '@modules/demandeModification'
import { LegacyModificationImported } from '@modules/modificationRequest'
import {
  DonnéesDeRaccordementRenseignées,
  handleLegacyModificationImported,
  handlePeriodeNotified,
  handleProjectCertificateObsolete,
  handleProjectRawDataImported,
  makeOnDonnéesDeRaccordementRenseignées,
  makeOnDélaiAccordé,
  PeriodeNotified,
  ProjectCertificateObsolete,
  ProjectRawDataImported,
  makeOnAnnulationAbandonAccordée,
} from '@modules/project'
import { subscribeToRedis } from '../eventBus.config'
import { eventStore } from '../eventStore.config'
import { findProjectByIdentifiers, getUnnotifiedProjectsForPeriode } from '../queries.config'
import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { projectRepo } from '../repos.config'
import { generateCertificate } from '../useCases.config'
import { makeOnAbandonAccordé } from '../../modules/project/eventHandlers/onAbandonAccordé'

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

  return onDélaiAccordéHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e)
  )
}
subscribeToRedis(onDélaiAccordé, 'Project.onDélaiAccordé')

const onAbandonAccordéHandler = makeOnAbandonAccordé({
  projectRepo,
  publishToEventStore: eventStore.publish,
})

const onAbandonAccordé = async (event: DomainEvent) => {
  if (!(event instanceof AbandonAccordé)) {
    return Promise.resolve()
  }

  return onAbandonAccordéHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e)
  )
}
subscribeToRedis(onAbandonAccordé, 'Project.onAbandonAccordé')

const onDonnéesDeRaccordementRenseignéesHandler = makeOnDonnéesDeRaccordementRenseignées({
  projectRepo,
  publishToEventStore: eventStore.publish,
  getProjectAppelOffre,
})

const onDonnéesDeRaccordementRenseignées = async (event: DomainEvent) => {
  if (!(event instanceof DonnéesDeRaccordementRenseignées)) {
    return Promise.resolve()
  }

  return onDonnéesDeRaccordementRenseignéesHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e)
  )
}

subscribeToRedis(onDonnéesDeRaccordementRenseignées, 'Project.onDonnéesDeRaccordementRenseignées')

const onAnnulationAbandonAccordéeHandler = makeOnAnnulationAbandonAccordée({
  projectRepo,
  publishToEventStore: eventStore.publish,
})

const onAnnulationAbandonAccordée = async (event: DomainEvent) => {
  if (!(event instanceof AnnulationAbandonAccordée)) {
    return Promise.resolve()
  }

  return onAnnulationAbandonAccordéeHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e)
  )
}

subscribeToRedis(onAnnulationAbandonAccordée, 'Project.onAnnulationAbandonAccordée')

console.log('Project Event Handlers Initialized')
export const projectHandlersOk = true
