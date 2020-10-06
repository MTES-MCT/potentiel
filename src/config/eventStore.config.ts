import { InMemoryEventStore } from '../infra/inMemory'
import { sequelizeEventStore } from '../infra/sequelize'
import { isTestEnv } from './env.config'

export const eventStore = isTestEnv
  ? new InMemoryEventStore()
  : sequelizeEventStore
