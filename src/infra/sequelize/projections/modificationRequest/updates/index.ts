import { EventBus } from '../../../../../modules/eventStore'
import {
  ModificationRequested,
  ModificationRequestAccepted,
  ResponseTemplateDownloaded,
} from '../../../../../modules/modificationRequest'
import { onModificationRequested } from './onModificationRequested'
import { onModificationRequestAccepted } from './onModificationRequestAccepted'
import { onResponseTemplateDownloaded } from './onResponseTemplateDownloaded'

export const initModificationRequestProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ModificationRequested.type, onModificationRequested(models))
  eventBus.subscribe(ModificationRequestAccepted.type, onModificationRequestAccepted(models))
  eventBus.subscribe(ResponseTemplateDownloaded.type, onResponseTemplateDownloaded(models))

  console.log('Initialized ModificationRequest projections')
}
