import { SequelizeModel } from '.'
import { BaseDomainEvent, DomainEvent } from '../../../core/domain'
import { makeSequelizeProjector } from './makeSequelizeProjector'

interface DummyEventPayload {}

class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

describe('makeSequelizeProjector', () => {
  describe('handle(Event, handler)', () => {
    describe('when called before initEventStream', () => {
      it('should register the handler on the eventStream', () => {
        const fakeModel = {} as SequelizeModel

        const handler = jest.fn((event: DummyEvent) => Promise.resolve())

        const projector = makeSequelizeProjector(fakeModel)

        projector.handle(DummyEvent, handler)

        const eventStreamHandler = jest.fn((eventType: string, eventHandler) => {})

        projector.initEventStream({
          lock: async () => {},
          unlock: async () => {},
          handle: eventStreamHandler,
        })

        expect(eventStreamHandler).toHaveBeenCalledWith('DummyEvent', handler)
      })
    })

    describe('when called after initEventStream', () => {
      it('should register the handler on the eventStream', () => {
        const fakeModel = {} as SequelizeModel

        const handler = jest.fn((event: DummyEvent) => Promise.resolve())

        const projector = makeSequelizeProjector(fakeModel)

        const eventStreamHandler = jest.fn((eventType: string, eventHandler) => {})

        projector.initEventStream({
          lock: async () => {},
          unlock: async () => {},
          handle: eventStreamHandler,
        })

        projector.handle(DummyEvent, handler)

        expect(eventStreamHandler).toHaveBeenCalledWith('DummyEvent', handler)
      })
    })
  })
})
