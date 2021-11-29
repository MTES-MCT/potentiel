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

describe('makeSequelizeProjector', () => {
  const fakeModel = {
    name: 'modelName',
  } as SequelizeModel

  describe('on(Event, handler)', () => {
    describe('when called before initEventStream', () => {
      it('should register the handler on the eventStream with a consumer name', () => {
        const handler = jest.fn((event: DummyEvent) => Promise.resolve())

        const projector = makeSequelizeProjector(fakeModel)

        projector.on(DummyEvent, handler)

        const eventStreamSubscribe = jest.fn(
          (eventType: string, eventHandler, consumerName: string) => {}
        )

        projector.initEventStream({
          subscribe: eventStreamSubscribe,
        })

        expect(eventStreamSubscribe).toHaveBeenCalledWith('DummyEvent', handler, 'modelName')
      })
    })

    describe('when called after initEventStream', () => {
      it('should register the handler on the eventStream with a consumer name', () => {
        const handler = jest.fn((event: DummyEvent) => Promise.resolve())

        const projector = makeSequelizeProjector(fakeModel)

        const eventStreamSubscribe = jest.fn(
          (eventType: string, eventHandler, consumerName: string) => {}
        )

        projector.initEventStream({
          subscribe: eventStreamSubscribe,
        })

        projector.on(DummyEvent, handler)

        expect(eventStreamSubscribe).toHaveBeenCalledWith('DummyEvent', handler, 'modelName')
      })
    })
  })
})
