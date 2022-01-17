import { toRedisMessage } from './toRedisMessage'
import { BaseDomainEvent, DomainEvent } from '@core/domain'

interface DummyEventPayload {
  projectId: string
  nombre: number
  bouleen: boolean
  tableau: string[]
}
class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return payload.projectId
  }
}

describe('toRedisMessage', () => {
  it('should convert a domain event into a redis message', () => {
    const payload = {
      projectId: '2',
      nombre: 4,
      bouleen: true,
      tableau: ['10', '11'],
    }
    const occurredAt = new Date(1234)
    const result = toRedisMessage(
      new DummyEvent({
        payload,
        original: { occurredAt, version: 1 },
      })
    )
    expect(result).toMatchObject({
      type: DummyEvent.type,
      payload,
      occurredAt: 1234,
    })
  })
})
