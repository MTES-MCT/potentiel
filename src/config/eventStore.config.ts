import { EventStore } from '../core/domain'
import { sequelizeEventStore } from '../infra/sequelize'

console.log(`EventStore will be using SequelizeEventStore`)

export const eventStore: EventStore = sequelizeEventStore
