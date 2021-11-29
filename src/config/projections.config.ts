import { initProjections, initProjectors, initProjectionsNext } from '../infra/sequelize'
import { eventStore } from './eventStore.config'

// This is legacy
initProjections(eventStore)

// This is initProjections replacement
const projectors = initProjectors(eventStore)
console.log(`Initialized projectors: ${projectors.join(', ')}`)

const projectorsNExt = initProjectionsNext({
  subscribe: (eventType, cb, consumerName) => {
    console.log(`${eventType} will update ${consumerName}`)
    // Here we can call the stream interface instead (and pass the consumer name)
    eventStore.subscribe(eventType, cb)
  },
})
console.log(`Initialized nextgen projectors: ${projectorsNExt.join(', ')}`)

console.log('Projections initialized')
