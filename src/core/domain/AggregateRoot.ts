import { Entity } from './Entity'
import { UniqueEntityID } from './UniqueEntityID'
import { DomainEvent } from './DomainEvent'

export abstract class AggregateRoot<T, IDomainEvent extends DomainEvent> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = []

  get id(): UniqueEntityID {
    return this._id
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent)
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length)
  }
}
