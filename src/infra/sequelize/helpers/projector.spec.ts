import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { makeProjector } from './projector'

export interface FakeEventPayload {
  param: string
}
export class FakeEvent extends BaseDomainEvent<FakeEventPayload> implements DomainEvent {
  public static type: 'FakeEvent' = 'FakeEvent'
  public type = FakeEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: FakeEventPayload) {
    return undefined
  }
}

describe('projector', () => {
  describe('on(Event).create', () => {
    const projector = makeProjector()
    const fakeModel = {
      create: jest.fn(),
    }

    const fakeEventBus = {
      subscribe: jest.fn(),
      publish: jest.fn(),
    }
    projector.initModel(fakeModel)
    projector.initEventBus(fakeEventBus)

    const fakeCallback = jest.fn((event: FakeEvent) => ({ param1: 'value1' }))

    beforeAll(() => {
      projector.on(FakeEvent).create(fakeCallback)
    })

    it('should add a listener for the FakeEvent', () => {
      expect(fakeEventBus.subscribe).toHaveBeenCalledTimes(1)

      const eventType = fakeEventBus.subscribe.mock.calls[0][0]
      expect(eventType).toEqual(FakeEvent.type)
    })

    it('should add a listener that calls model.create with the value returned by the callback', () => {
      const listener = fakeEventBus.subscribe.mock.calls[0][1]

      // Call the listener with a fake event
      const fakeEvent = new FakeEvent({ payload: { param: '123' } })
      listener(fakeEvent)

      expect(fakeCallback).toHaveBeenCalledWith(fakeEvent)
      expect(fakeModel.create).toHaveBeenCalledWith({ param1: 'value1' })
    })
  })

  describe('on(Event).delete', () => {
    const projector = makeProjector()
    const fakeModel = {
      destroy: jest.fn(),
    }

    const fakeEventBus = {
      subscribe: jest.fn(),
      publish: jest.fn(),
    }
    projector.initModel(fakeModel)
    projector.initEventBus(fakeEventBus)

    const fakeWhere = jest.fn((event: FakeEvent) => ({ id: 'value1' }))

    beforeAll(() => {
      projector.on(FakeEvent).delete(fakeWhere)
    })

    it('should add a listener for the FakeEvent', () => {
      expect(fakeEventBus.subscribe).toHaveBeenCalledTimes(1)

      const eventType = fakeEventBus.subscribe.mock.calls[0][0]
      expect(eventType).toEqual(FakeEvent.type)
    })

    it('should add a listener that calls model.destroy with the where clause', () => {
      const listener = fakeEventBus.subscribe.mock.calls[0][1]

      // Call the listener with a fake event
      const fakeEvent = new FakeEvent({ payload: { param: '123' } })
      listener(fakeEvent)

      expect(fakeWhere).toHaveBeenCalledWith(fakeEvent)
      expect(fakeModel.destroy).toHaveBeenCalledWith({ where: { id: 'value1' } })
    })
  })

  describe('on(Event).update', () => {
    const projector = makeProjector()

    const fakeInstance = {
      save: jest.fn(() => Promise.resolve()),
      set: jest.fn((key: string, value: any) => {}),
      get: jest.fn(() => undefined),
    }
    const fakeModel = {
      findOne: jest.fn((args: any) => Promise.resolve(fakeInstance)),
    }

    const fakeEventBus = {
      subscribe: jest.fn(),
      publish: jest.fn(),
    }
    projector.initModel(fakeModel)
    projector.initEventBus(fakeEventBus)

    const fakeDeltaCallback = jest.fn((event: FakeEvent) => ({ param1: 'value1' }))
    const fakeWhereCallback = jest.fn((event: FakeEvent) => ({ id: '1234' }))

    beforeAll(() => {
      projector.on(FakeEvent).update({ where: fakeWhereCallback, delta: fakeDeltaCallback })
    })

    it('should add a listener for the FakeEvent', () => {
      expect(fakeEventBus.subscribe).toHaveBeenCalledTimes(1)

      const eventType = fakeEventBus.subscribe.mock.calls[0][0]
      expect(eventType).toEqual(FakeEvent.type)
    })

    it('should add a listener that calls model.findOne with the where value from the callback, apply the delta value from the callback to it and then call instance.save', async () => {
      const listener = fakeEventBus.subscribe.mock.calls[0][1]

      // Call the listener with a fake event
      const fakeEvent = new FakeEvent({ payload: { param: '123' } })
      await listener(fakeEvent)

      expect(fakeDeltaCallback).toHaveBeenCalledWith(fakeEvent)
      expect(fakeWhereCallback).toHaveBeenCalledWith(fakeEvent)

      expect(fakeModel.findOne).toHaveBeenCalledWith({ where: { id: '1234' } })
      expect(fakeInstance.set).toHaveBeenCalledWith('param1', 'value1')
      expect(fakeInstance.save).toHaveBeenCalled()
    })
  })
})
