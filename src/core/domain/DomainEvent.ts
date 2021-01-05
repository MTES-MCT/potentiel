export interface DomainEvent {
  occurredAt: Date
  type: string
  getVersion: () => number
  aggregateId: string[] | string | undefined
  requestId?: string
  payload: any
}

export interface BaseDomainEventProps<P> {
  payload: P
  requestId?: DomainEvent['requestId']
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

  constructor({ payload, requestId, original }: BaseDomainEventProps<P>) {
    this.payload = payload
    this.occurredAt = original?.occurredAt || new Date()
    this.requestId = requestId
    this.aggregateId = this.aggregateIdFromPayload(payload)

    if (original?.version) {
      this.originalVersion = original.version
    }
  }

  abstract aggregateIdFromPayload(payload: P): DomainEvent['aggregateId'] | undefined

  getVersion() {
    return this.originalVersion || this.currentVersion
  }
}
