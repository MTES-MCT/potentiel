import { initProjections, initProjectors, ProjectEventProjector } from '@infra/sequelize'
import { subscribeToRedis } from './eventBus.config'
import { eventStore } from './eventStore.config'

// This is legacy
initProjections(eventStore)

// This is initProjections replacement
const projectors = initProjectors(eventStore)
console.log(`Initialized projectors: ${projectors.join(', ')}`)

const projectorsNext = [ProjectEventProjector].map((projector) => {
  projector.initEventStream({
    subscribe: subscribeToRedis,
  })
  return projector.name
})

console.log(`Initialized nextgen projectors: ${projectorsNext.join(', ')}`)

console.log('Projections initialized')
