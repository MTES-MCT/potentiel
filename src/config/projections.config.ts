import { initProjections, initProjectors, initProjectionsNext } from '../infra/sequelize'
import { subscribeToRedis } from './eventBus.config'
import { eventStore } from './eventStore.config'

// This is legacy
initProjections(eventStore)

// This is initProjections replacement
const projectors = initProjectors(eventStore)
console.log(`Initialized projectors: ${projectors.join(', ')}`)

const projectorsNExt = initProjectionsNext({
  subscribe: subscribeToRedis,
})
console.log(`Initialized nextgen projectors: ${projectorsNExt.join(', ')}`)

console.log('Projections initialized')
