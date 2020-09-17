export interface DomainEvent<P> {
  occurredAt: Date
  type: string
  payload: P
}
