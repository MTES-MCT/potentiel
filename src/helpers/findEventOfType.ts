import { Constructor, DomainEvent, HasType } from '../core/domain'

export const findEventOfType = <Event extends DomainEvent>(
  eventCtr: Constructor<Event> & HasType,
  arr: readonly DomainEvent[]
): Event | undefined => {
  return arr.find((item): item is Event => item.type === eventCtr.type)
}
