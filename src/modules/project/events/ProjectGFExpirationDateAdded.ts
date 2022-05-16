import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectGFExpirationDateAddedPayload {
  projectId: string
  submittedBy: string
  expirationDate: Date
}
export class ProjectGFExpirationDateAdded
  extends BaseDomainEvent<ProjectGFExpirationDateAddedPayload>
  implements DomainEvent
{
  public static type: 'ProjectGFExpirationDateAdded' = 'ProjectGFExpirationDateAdded'
  public type = ProjectGFExpirationDateAdded.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectGFExpirationDateAddedPayload>) {
    super(props)

    // convert to date (in case it is a string)
    this.payload.expirationDate = new Date(this.payload.expirationDate)
  }

  aggregateIdFromPayload(payload: ProjectGFExpirationDateAddedPayload) {
    return payload.projectId
  }
}
