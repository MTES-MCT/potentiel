import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectGFSubmittedPayload {
  projectId: string
  gfDate: Date
  fileId: string
  submittedBy: string
  expirationDate?: Date
}
export class ProjectGFSubmitted
  extends BaseDomainEvent<ProjectGFSubmittedPayload>
  implements DomainEvent
{
  public static type: 'ProjectGFSubmitted' = 'ProjectGFSubmitted'
  public type = ProjectGFSubmitted.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectGFSubmittedPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: ProjectGFSubmittedPayload) {
    return payload.projectId
  }
}
