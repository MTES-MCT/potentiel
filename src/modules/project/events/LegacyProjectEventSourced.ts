import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

//
// This event is a value dump for items that were in the deprecated projectEvents table before the switch to event sourcing
//

export interface LegacyProjectEventSourcedPayload {
  projectId: string
  before: Record<string, any>
  after: Record<string, any>
  createdAt: Date
  userId: string
  type: string
  modificationRequestId: string
}
export class LegacyProjectEventSourced
  extends BaseDomainEvent<LegacyProjectEventSourcedPayload>
  implements DomainEvent {
  public static type: 'LegacyProjectEventSourced' = 'LegacyProjectEventSourced'
  public type = LegacyProjectEventSourced.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<LegacyProjectEventSourcedPayload>) {
    super(props)

    // convert to date (in case it is a string)
    this.payload.createdAt = new Date(this.payload.createdAt)
  }

  aggregateIdFromPayload(payload: LegacyProjectEventSourcedPayload) {
    return payload.projectId
  }
}
