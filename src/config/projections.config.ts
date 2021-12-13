import { initProjections, initProjectors, initProjectionsNext } from '../infra/sequelize'
import { eventStore } from './eventStore.config'

// This is legacy
initProjections(eventStore)

// This is initProjections replacement
const projectors = initProjectors(eventStore)
console.log(`Initialized projectors: ${projectors.join(', ')}`)

const projectorsNext = initProjectionsNext({
  subscribe: (cb, consumerName) => {
    console.log(`${consumerName} is listening to incoming events`)
    // TODO: send ALL events to the callback
  },
})
console.log(`Initialized nextgen projectors: ${projectorsNext.join(', ')}`)

console.log('Projections initialized')
