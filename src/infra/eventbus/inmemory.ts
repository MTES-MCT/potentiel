import { EventBus } from '../../core/utils'
import { DomainEvent } from '../../core/domain'
import { v4 as uuid } from 'uuid'
import { EventEmitter } from 'events'

type Subscriptions = {
  [eventType: string]: {
    [id: string]: (payload: any) => void
  }
}

export class InMemoryEventBus implements EventBus {
  private subscriptions: Subscriptions = {}

  private eventEmitter: EventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
  }

  publish = <T extends DomainEvent<P>, P>(event: T): void => {
    // Object.values(this.subscriptions[event.type] || {}).forEach((callback) => {
    //   callback(event.payload)
    // })

    this.eventEmitter.emit(event.type, event.payload)
  }

  subscribe = <T extends DomainEvent<P>, P>(
    eventType: T['type'],
    callback: (payload: P) => void
  ): void => {
    // const id = uuid()

    // if (!this.subscriptions[eventType]) {
    //   this.subscriptions[eventType] = {}
    // }

    // this.subscriptions[eventType][id] = callback

    this.eventEmitter.on(eventType, callback)
  }
}
