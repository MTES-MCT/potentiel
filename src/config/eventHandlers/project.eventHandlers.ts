import { handlePeriodeNotified } from '../../modules/project/eventHandlers'
import { PeriodeNotified } from '../../modules/project/events'
import { eventStore } from '../eventStore.config'
import { getUnnotifiedProjectsForPeriode } from '../queries.config'
import { projectRepo } from '../repos.config'
import { generateCertificate } from '../useCases.config'
import { logger } from '../../core/utils'

eventStore.subscribe(
  PeriodeNotified.type,
  handlePeriodeNotified({
    projectRepo,
    generateCertificate,
    getUnnotifiedProjectsForPeriode,
  })
)

logger.info('Project Event Handlers Initialized')
export const projectHandlersOk = true
