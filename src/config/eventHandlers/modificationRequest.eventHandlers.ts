import { ResponseTemplateDownloaded } from '../../modules/modificationRequest'
import { handleResponseTemplateDownloaded } from '../../modules/modificationRequest/eventHandlers/handleResponseTemplateDownloaded'
import { eventStore } from '../eventStore.config'
import { getModificationRequestStatus } from '../../infra/sequelize/queries'

eventStore.subscribe(
  ResponseTemplateDownloaded.type,
  handleResponseTemplateDownloaded({
    eventBus: eventStore,
    getModificationRequestStatus,
  })
)

console.log('Modification Request Event Handlers Initialized')
export const modificationRequestsHandlersOk = true
