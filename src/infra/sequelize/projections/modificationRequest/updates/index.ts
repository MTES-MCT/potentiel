import { EventBus } from '../../../../../modules/eventStore'
import { ModificationRequested, RecoursAccepted } from '../../../../../modules/modificationRequest'
import { onModificationRequested } from './onModificationRequested'
import { onRecoursAccepted } from './onRecoursAccepted'

export const initModificationRequestProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ModificationRequested.type, onModificationRequested(models))
  eventBus.subscribe(RecoursAccepted.type, onRecoursAccepted(models))

  console.log('Initialized ModificationRequest projections')
}
