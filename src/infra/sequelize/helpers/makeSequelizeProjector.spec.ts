import { BaseDomainEvent, DomainEvent } from '../../../core/domain'
import { makeSequelizeProjector, SequelizeModel } from './makeSequelizeProjector'

interface DummyEventPayload {}

class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

interface OtherDummyEventPayload {}

class OtherDummyEvent extends BaseDomainEvent<OtherDummyEventPayload> implements DomainEvent {
  public static type: 'OtherDummyEvent' = 'OtherDummyEvent'
  public type = OtherDummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: OtherDummyEventPayload) {
    return undefined
  }
}

describe('makeSequelizeProjector', () => {
  const fakeModel = {
    name: 'modelName',
  } as SequelizeModel

  describe('on(Event, handler)', () => {
    describe('when called for the same event type', () => {
      const handler = jest.fn((event: DummyEvent) => Promise.resolve())
      const handler2 = jest.fn((event: DummyEvent) => Promise.resolve())

      const projector = makeSequelizeProjector(fakeModel)
      projector.on(DummyEvent, handler)

      it('should throw an error', () => {
        expect(() => projector.on(DummyEvent, handler2)).toThrow()
      })
    })

    describe('when called before initEventStream', () => {
      const handler = jest.fn((event: DummyEvent) => Promise.resolve())
      const handler2 = jest.fn((event: OtherDummyEvent) => Promise.resolve())

      const projector = makeSequelizeProjector(fakeModel)
      projector.on(DummyEvent, handler)
      projector.on(OtherDummyEvent, handler2)

      const eventStreamSubscribe = jest.fn((eventHandler, consumerName: string) => {})

      projector.initEventStream({
        subscribe: eventStreamSubscribe,
      })

      it('should register a single handler on the eventStream, with the model as consumerName', () => {
        expect(eventStreamSubscribe).toHaveBeenCalledTimes(1)
        expect(eventStreamSubscribe).toHaveBeenCalledWith(expect.anything(), 'modelName')
      })

      it('should call the handlers for the specific type when the event arises', () => {
        const innerDummyEventHandler = eventStreamSubscribe.mock.calls[0][0]
        const fakeDummyEvent = new DummyEvent({ payload: {} })
        innerDummyEventHandler(fakeDummyEvent)

        expect(handler).toHaveBeenCalledWith(fakeDummyEvent)
        expect(handler2).not.toHaveBeenCalled()
      })
    })

    describe('when called after initEventStream', () => {
      const handler = jest.fn((event: DummyEvent) => Promise.resolve())
      const handler2 = jest.fn((event: OtherDummyEvent) => Promise.resolve())

      const projector = makeSequelizeProjector(fakeModel)
      const eventStreamSubscribe = jest.fn((eventHandler, consumerName: string) => {})

      projector.initEventStream({
        subscribe: eventStreamSubscribe,
      })

      projector.on(DummyEvent, handler)
      projector.on(OtherDummyEvent, handler2)

      it('should register a single handler on the eventStream, with the model as consumerName', () => {
        expect(eventStreamSubscribe).toHaveBeenCalledTimes(1)
        expect(eventStreamSubscribe).toHaveBeenCalledWith(expect.anything(), 'modelName')
      })

      it('should call the handlers for the specific type when the event arises', () => {
        const innerDummyEventHandler = eventStreamSubscribe.mock.calls[0][0]
        const fakeDummyEvent = new DummyEvent({ payload: {} })
        innerDummyEventHandler(fakeDummyEvent)

        expect(handler).toHaveBeenCalledWith(fakeDummyEvent)
        expect(handler2).not.toHaveBeenCalled()
      })
    })
  })

  describe('handleEvent(Event)', () => {
    const handler = jest.fn((event: DummyEvent) => Promise.resolve())
    const handler2 = jest.fn((event: OtherDummyEvent) => Promise.resolve())

    const projector = makeSequelizeProjector(fakeModel)
    projector.on(DummyEvent, handler)
    projector.on(OtherDummyEvent, handler2)

    it(`should call the handler for the event to handle`, async () => {
      const fakeDummyEvent = new DummyEvent({ payload: {} })

      await projector.handleEvent(fakeDummyEvent)

      expect(handler).toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
    })
  })
})
