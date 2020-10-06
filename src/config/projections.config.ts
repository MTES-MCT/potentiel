import { initProjections } from '../infra/sequelize'
import { eventStore } from './eventStore.config'

initProjections(eventStore)
