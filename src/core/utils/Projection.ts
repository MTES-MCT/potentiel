import { Constructor, DomainEvent, HasType } from '../domain'

export interface Handler<Event> {
  (event: Event): any
}

export interface HandlerFactory<Model, Event> {
  (model: Model): Handler<Event>
}

export interface Projection<ProjectionModel> {
  handle: <Event extends DomainEvent>(
    eventClass: Constructor<Event> & HasType,
    eventHandler: HandlerFactory<any, Event>
  ) => Handler<Event>

  readonly name: string

  lock: () => Promise<void>
  unlock: () => Promise<void>
  transaction: (callback: (model: ProjectionModel) => Promise<void>) => Promise<void>

  initEventStream: (makeEventStream: EventStreamFactory) => void
}
export interface EventStream {
  on: <Event extends DomainEvent>(event: Event['type'], cb: (event: Event) => unknown) => void
  lock: () => Promise<void>
  unlock: () => Promise<void>
}
export interface EventStreamFactory {
  (streamName): EventStream
}
