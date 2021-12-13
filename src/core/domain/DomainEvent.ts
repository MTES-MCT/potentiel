import { UniqueEntityID } from '.'

export interface DomainEvent {
  id: string
  occurredAt: Date
  type: string
  aggregateId: string[] | string | undefined
  requestId?: string
  payload: any
}

export interface BaseDomainEventProps<P> {
  payload: P
  requestId?: DomainEvent['requestId']
  original?: {
    occurredAt: DomainEvent['occurredAt']
    eventId?: string
  }
}
export abstract class BaseDomainEvent<P> {
  public readonly payload: P
  public readonly id: DomainEvent['id']
  public readonly requestId: DomainEvent['requestId']
  public readonly aggregateId: DomainEvent['aggregateId']
  public readonly occurredAt: DomainEvent['occurredAt']

  constructor({ payload }: BaseDomainEventProps<P>) {
    this.payload = payload
    this.occurredAt = new Date()
    this.id = new UniqueEntityID().toString()
    this.aggregateId = this.aggregateIdFromPayload(payload)
  }

  abstract aggregateIdFromPayload(payload: P): DomainEvent['aggregateId']
}
