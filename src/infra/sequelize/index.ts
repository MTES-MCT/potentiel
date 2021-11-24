import models from './models'
import {
  initModificationRequestProjections,
  initProjectProjections,
  initUserProjectsProjections,
  initProjectPTFProjections,
  initAppelOffreProjections,
} from './projections'
import { initUserProjectClaimsProjections } from './projections/userProjectClaims/updates'
import { EventStore } from '../../core/domain'

export { initProjectors } from './models'
export { persistEventsToStore, loadAggregateEventsFromStore } from './eventStore'

export const initProjections = (eventStore: EventStore) => {
  initProjectProjections(eventStore, models)
  initModificationRequestProjections(eventStore, models)
  initUserProjectsProjections(eventStore, models)
  initProjectPTFProjections(eventStore, models)
  initAppelOffreProjections(eventStore, models)
  initUserProjectClaimsProjections(eventStore, models)
}
