import { UniqueEntityID } from '.'

export interface DomainEvent {
  id: string
  occurredAt: Date
  type: string
  aggregateId: string[] | string | undefined
  requestId?: string
  payload: any
}

type ValidEventPayload = any & {
  payload: never
  original: never
}

export interface WrappedDomainEventProps<P> {
  payload: P
  original?: {
    occurredAt: Date
    eventId?: string
  }
}
export abstract class BaseDomainEvent<P extends ValidEventPayload> {
  public readonly payload: P
  public readonly id: DomainEvent['id']
  public readonly requestId: DomainEvent['requestId']
  public readonly aggregateId: DomainEvent['aggregateId']
  public readonly occurredAt: DomainEvent['occurredAt']

  constructor(args: P | WrappedDomainEventProps<P>) {
    this.id = new UniqueEntityID().toString()
    this.occurredAt = new Date()

    // @ts-ignore
    if (args.original) {
      // @ts-ignore
      this.occurredAt = args.original.occurredAt

      // @ts-ignore
      if (args.original.eventId) {
        // @ts-ignore
        this.id = args.original.eventId
      }
    }

    // @ts-ignore
    const payload = args.payload || args

    this.aggregateId = this.aggregateIdFromPayload(payload)
  }

  abstract aggregateIdFromPayload(payload: P): DomainEvent['aggregateId']
}
