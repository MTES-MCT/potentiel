import { InMemoryEventStore } from '../infra/inMemory'
import { sequelizeEventStore } from '../infra/sequelize'
import { EventStore } from '../modules/eventStore'
import { isTestEnv } from './env.config'
import { logger } from '../core/utils'

logger.info(`EventStore will be using ${isTestEnv ? 'InMemoryEventStore' : 'SequelizeEventStore'}`)

export const eventStore: EventStore = isTestEnv ? new InMemoryEventStore() : sequelizeEventStore
