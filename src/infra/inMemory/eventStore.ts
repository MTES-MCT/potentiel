import { EventEmitter } from 'events'
import { DomainEvent } from '../../core/domain'
import { ResultAsync, Queue, okAsync } from '../../core/utils'
import {
  EventStore,
  BaseEventStore,
  EventStoreHistoryFilters,
  EventStoreTransactionFn,
  StoredEvent,
} from '../../modules/eventStore'
import { InfraNotAvailableError } from '../../modules/shared'

export class InMemoryEventStore extends BaseEventStore {
  private history: StoredEvent[] = []

  protected persistEvent(
    event: StoredEvent
  ): ResultAsync<null, InfraNotAvailableError> {
    this.history.push(event)
    return okAsync<null, InfraNotAvailableError>(null)
  }

  public loadHistory(
    filters?: EventStoreHistoryFilters
  ): ResultAsync<StoredEvent[], InfraNotAvailableError> {
    let history = this.history

    if (filters) {
      const { eventType, requestId, payload, aggregateId } = filters

      if (eventType) {
        if (Array.isArray(eventType)) {
          history = history.filter((event) => eventType.includes(event.type))
        } else {
          history = history.filter((event) => event.type === eventType)
        }
      }

      if (requestId) {
        history = history.filter((event) => event.requestId === requestId)
      }

      if (aggregateId) {
        history = history.filter((event) => event.aggregateId === aggregateId)
      }

      if (payload) {
        history = history.filter((event) =>
          Object.entries(payload).every(
            ([key, value]) => event.payload[key] === value
          )
        )
      }
    }

    return okAsync<StoredEvent[], InfraNotAvailableError>(history)
  }
}
// export class InMemoryEventStore implements EventStore {
//   private history: StoredEvent[] = []

//   private queue: Queue

//   private eventEmitter: EventEmitter

//   constructor() {
//     this.eventEmitter = new EventEmitter()
//     this.queue = new Queue()
//   }

//   publish(event: StoredEvent): ResultAsync<null, InfraNotAvailableError> {
//     const ticket = this.queue.push(() => {
//       this._publishSync(event)
//       return null
//     })
//     return ResultAsync.fromPromise(ticket, () => new InfraNotAvailableError())
//   }

//   subscribe<T extends StoredEvent>(
//     eventType: T['type'],
//     callback: (event: T) => any
//   ) {
//     console.log('InMemoryEventStore subscription to', eventType)

//     this.eventEmitter.on(eventType, callback)
//   }

//   transaction(fn: EventStoreTransactionFn) {
//     const ticket = this.queue.push(async () => {
//       const eventsToEmit: StoredEvent[] = []
//       await fn({
//         loadHistory: (filters) => {
//           console.log('InMemoryEventStore loadHistory inside transaction')
//           return this._loadHistory(filters)
//         },
//         publish: (event: StoredEvent) => {
//           console.log('InMemoryEventStore publish inside transaction', event)
//           return this._persistEvent(event).andThen(() => {
//             // Delay emission of events till the end of the transaction
//             eventsToEmit.push(event)
//             return okAsync(null)
//           })
//         },
//       })

//       // console.log(
//       //   'InMemoryEventStore transaction done, emitting events',
//       //   eventsToEmit
//       // )
//       for (const event of eventsToEmit) {
//         this._emitEvent(event)
//       }
//     })
//     return ResultAsync.fromPromise(ticket, () => new InfraNotAvailableError())
//   }

//   private _loadHistory(filters?: EventStoreHistoryFilters) {
//     console.log('InMemoryEventStore _loadHistory with filters', filters)
//     let history = this.history

//     if (filters) {
//       const { eventType, requestId, payload, aggregateId } = filters

//       if (eventType) {
//         if (Array.isArray(eventType)) {
//           history = history.filter((event) => eventType.includes(event.type))
//         } else {
//           history = history.filter((event) => event.type === eventType)
//         }
//       }

//       if (requestId) {
//         history = history.filter((event) => event.requestId === requestId)
//       }

//       if (aggregateId) {
//         history = history.filter((event) => event.aggregateId === aggregateId)
//       }

//       if (payload) {
//         history = history.filter((event) =>
//           Object.entries(payload).every(
//             ([key, value]) => event.payload[key] === value
//           )
//         )
//       }
//     }

//     return okAsync<StoredEvent[], InfraNotAvailableError>(history)
//   }

//   private _persistEvent(event: StoredEvent) {
//     this.history.push(event)
//     return okAsync<null, InfraNotAvailableError>(null)
//   }

//   private _emitEvent(event: StoredEvent) {
//     console.log('Event: publish [' + event.type + ']')
//     this.eventEmitter.emit(event.type, event)
//   }

//   private _publishSync = (event: StoredEvent) => {
//     this._persistEvent(event)
//     this._emitEvent(event)
//     return okAsync<null, InfraNotAvailableError>(null)
//   }
// }
