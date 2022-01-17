import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { makeFakeEventBus } from '../fixtures/aggregates'

interface DummyEventPayload {
  param1: string
  param2: {
    sub1: number
    sub2: string
  }
  param3: string[]
}

class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

interface OtherEventPayload {
  param1: string
  param2: {
    sub1: number
    sub2: string
  }
  param3: string[]
}

class OtherEvent extends BaseDomainEvent<OtherEventPayload> implements DomainEvent {
  public static type: 'OtherEvent' = 'OtherEvent'
  public type = OtherEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: OtherEventPayload) {
    return undefined
  }
}

describe('expect.toHavePublishedWithPayload(eventType, payload)', () => {
  it('should pass if the eventBus triggered an event of the type eventType and exact same payload', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(
      new DummyEvent({
        payload: {
          param1: 'param1',
          param2: {
            sub1: 1,
            sub2: 'sub2',
          },
          param3: ['param3'],
        },
      })
    )

    expect(eventBus).toHavePublishedWithPayload(DummyEvent, {
      param1: 'param1',
      param2: {
        sub1: 1,
        sub2: 'sub2',
      },
      param3: ['param3'],
    })
  })

  it('should pass if the eventBus triggered an event of the type eventType and a payload the matches', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(
      new DummyEvent({
        payload: {
          param1: 'param1',
          param2: {
            sub1: 1,
            sub2: 'sub2',
          },
          param3: ['param3'],
        },
      })
    )

    expect(eventBus).toHavePublishedWithPayload(DummyEvent, {
      param2: {
        sub2: 'sub2',
      },
      param3: ['param3'],
    })
  })

  it('should pass if the eventBus triggered multiple events of the type eventType and one of which has a payload the matches', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(
      new DummyEvent({
        payload: {
          param1: 'param1bis',
          param2: {
            sub1: 2,
            sub2: 'sub3',
          },
          param3: [],
        },
      })
    )
    eventBus.publish(
      new DummyEvent({
        payload: {
          param1: 'param1',
          param2: {
            sub1: 1,
            sub2: 'sub2',
          },
          param3: ['param3'],
        },
      })
    )

    expect(eventBus).toHavePublishedWithPayload(DummyEvent, {
      param2: {
        sub2: 'sub2',
      },
      param3: ['param3'],
    })
  })

  it('should fail if the eventBus triggered an event of the type eventType and a payload that does not match', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(
      new DummyEvent({
        payload: {
          param1: 'param1',
          param2: {
            sub1: 1,
            sub2: 'sub2',
          },
          param3: ['param3'],
        },
      })
    )

    expect(eventBus).not.toHavePublishedWithPayload(DummyEvent, {
      param1: 'notparam1',
      param2: {
        sub2: 'sub2',
      },
      param3: ['param3', 'notparam3'],
    })
  })

  it('should fail if the eventBus triggered an event of another type with a payload that matches', () => {
    const eventBus = makeFakeEventBus()
    const payload = {
      param1: 'param1',
      param2: {
        sub1: 1,
        sub2: 'sub2',
      },
      param3: ['param3'],
    }
    eventBus.publish(
      new DummyEvent({
        payload,
      })
    )

    expect(eventBus).not.toHavePublishedWithPayload(OtherEvent, payload)
  })

  it('should fail if the eventBus triggered no events', () => {
    const eventBus = makeFakeEventBus()

    expect(eventBus).not.toHavePublishedWithPayload(OtherEvent, {})
  })
})
