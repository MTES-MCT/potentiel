import { InMemoryEventStore } from '../infra/inMemory'
import { sequelizeEventStore } from '../infra/sequelize'
import { isTestEnv } from './env.config'

console.log(
  'EventStore will be using ' +
    (isTestEnv ? 'InMemoryEventStore' : 'SequelizeEventStore')
)

export const eventStore = isTestEnv
  ? new InMemoryEventStore()
  : sequelizeEventStore
