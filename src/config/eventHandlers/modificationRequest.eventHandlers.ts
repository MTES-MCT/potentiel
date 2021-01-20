import { ResponseTemplateDownloaded } from '../../modules/modificationRequest'
import { handleResponseTemplateDownloaded } from '../../modules/modificationRequest/eventHandlers/handleResponseTemplateDownloaded'
import { eventStore } from '../eventStore.config'
import { getModificationRequestStatus } from '../queries.config'
import { logger } from '../../core/utils'

eventStore.subscribe(
  ResponseTemplateDownloaded.type,
  handleResponseTemplateDownloaded({
    eventBus: eventStore,
    getModificationRequestStatus,
  })
)

logger.info('Modification Request Event Handlers Initialized')
export const modificationRequestsHandlersOk = true
