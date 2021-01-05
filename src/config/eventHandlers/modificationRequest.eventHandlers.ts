import { ResponseTemplateDownloaded } from '../../modules/modificationRequest'
import { handleResponseTemplateDownloaded } from '../../modules/modificationRequest/eventHandlers/handleResponseTemplateDownloaded'
import { eventStore } from '../eventStore.config'
import { getModificationRequestStatus } from '../queries.config'

eventStore.subscribe(
  ResponseTemplateDownloaded.type,
  handleResponseTemplateDownloaded({
    eventBus: eventStore,
    getModificationRequestStatus,
  })
)

console.log('Modification Request Event Handlers Initialized')
export const modificationRequestsHandlersOk = true
