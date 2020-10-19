import { Domain } from 'domain'

export interface DomainEvent {
  occurredAt: Date
  type: string
  getVersion: () => number
  aggregateId?: string[] | string
  requestId?: string
  payload: any
}

export interface BaseDomainEventProps<P> {
  payload: P
  requestId?: DomainEvent['requestId']
  aggregateId?: DomainEvent['aggregateId']
  original?: {
    occurredAt: DomainEvent['occurredAt']
    version: ReturnType<DomainEvent['getVersion']>
  }
}
export abstract class BaseDomainEvent<P> {
  public readonly payload: P
  public readonly requestId: DomainEvent['requestId']
  public readonly aggregateId: DomainEvent['aggregateId']
  public readonly occurredAt: DomainEvent['occurredAt']
  private originalVersion: ReturnType<DomainEvent['getVersion']>

  abstract readonly currentVersion: number

  constructor({
    payload,
    requestId,
    aggregateId,
    original,
  }: BaseDomainEventProps<P>) {
    this.payload = payload
    this.occurredAt = original?.occurredAt || new Date()
    this.requestId = requestId
    this.aggregateId = aggregateId

    if (original?.version) {
      this.originalVersion = original.version
    }
  }

  getVersion() {
    return this.originalVersion || this.currentVersion
  }
}
