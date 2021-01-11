import { initProjectProjections } from './projections/project'
import models from './models'
import { EventStore } from '../../modules/eventStore'
import { SequelizeEventStore } from './eventStore/sequelizeEventStore'
import { initModificationRequestProjections } from './projections'

export const sequelizeEventStore = new SequelizeEventStore(models)

export const initProjections = (eventStore: EventStore) => {
  initProjectProjections(eventStore, models)
  initModificationRequestProjections(eventStore, models)
}
