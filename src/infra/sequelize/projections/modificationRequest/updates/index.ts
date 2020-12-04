import { EventBus } from '../../../../../modules/eventStore'
import {
  ModificationRequested,
  RecoursAccepted,
  ResponseTemplateDownloaded,
} from '../../../../../modules/modificationRequest'
import { onModificationRequested } from './onModificationRequested'
import { onRecoursAccepted } from './onRecoursAccepted'
import { onResponseTemplateDownloaded } from './onResponseTemplateDownloaded'

export const initModificationRequestProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ModificationRequested.type, onModificationRequested(models))
  eventBus.subscribe(RecoursAccepted.type, onRecoursAccepted(models))
  eventBus.subscribe(ResponseTemplateDownloaded.type, onResponseTemplateDownloaded(models))

  console.log('Initialized ModificationRequest projections')
}
