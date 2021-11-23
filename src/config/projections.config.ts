import { initProjections, initProjectors } from '../infra/sequelize'
import { initProjections2 } from '../infra/sequelize2'
import { eventStore } from './eventStore.config'

// This is legacy
initProjections(eventStore)

// This is initProjections replacement
const projectors = initProjectors(eventStore)
console.log(`Initialized projectors: ${projectors.join(', ')}`)

const projectors2 = initProjections2((streamName) => {
  return {
    handle: (eventType, cb) => {
      console.log(`EventStream '${streamName}' is listening to ${eventType}`)
      eventStore.subscribe(eventType, (event) => {
        console.log('EventStream emitting event', event)
        cb(event)
      })
    },
    lock: async () => {},
    unlock: async () => {},
  }
})
console.log(`Initialized projectors2: ${projectors2.join(', ')}`)

console.log('Projections initialized')
