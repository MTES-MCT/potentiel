import { withDelay } from '../../core/utils'
import {
  LegacyModificationRawDataImported,
  ResponseTemplateDownloaded,
  handleResponseTemplateDownloaded,
  handleLegacyModificationRawDataImported,
} from '@modules/modificationRequest'
import { eventStore } from '../eventStore.config'
import { getModificationRequestStatus, findProjectByIdentifiers } from '../queries.config'

eventStore.subscribe(
  ResponseTemplateDownloaded.type,
  handleResponseTemplateDownloaded({
    eventBus: eventStore,
    getModificationRequestStatus,
  })
)

eventStore.subscribe(
  LegacyModificationRawDataImported.type,
  handleLegacyModificationRawDataImported({
    eventBus: eventStore,
    findProjectByIdentifiers,
    withDelay,
  })
)

console.log('Modification Request Event Handlers Initialized')
export const modificationRequestsHandlersOk = true
