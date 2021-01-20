import { initProjections } from '../infra/sequelize'
import { eventStore } from './eventStore.config'
import { logger } from '../core/utils'

initProjections(eventStore)

logger.info('Projections initialized')
