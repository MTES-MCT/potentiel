import models from './models'
import { EventStore } from '../../modules/eventStore'
import { SequelizeEventStore } from './eventStore/sequelizeEventStore'
import {
  initModificationRequestProjections,
  initProjectProjections,
  initUserProjectsProjections,
  initAdmissionKeyProjections,
  initProjectPTFProjections,
  initAppelOffreProjections,
} from './projections'

export const sequelizeEventStore = new SequelizeEventStore(models)

export const initProjections = (eventStore: EventStore) => {
  initProjectProjections(eventStore, models)
  initModificationRequestProjections(eventStore, models)
  initUserProjectsProjections(eventStore, models)
  initAdmissionKeyProjections(eventStore, models)
  initProjectPTFProjections(eventStore, models)
  initAppelOffreProjections(eventStore, models)
}
